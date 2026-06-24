"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";
import {
  clearAssessment,
  emptyAssessment,
  loadAssessment,
  sampleAssessment,
  saveAssessment,
} from "@/lib/store";
import { buildRegister, summarize } from "@/lib/scoring";
import type {
  AssessmentDocument,
  AssessmentSummary,
  ControlResponse,
  RiskRegisterEntry,
} from "@/lib/scoring";

interface AssessmentContextValue {
  /** The current assessment document. */
  doc: AssessmentDocument;
  /** Rolled-up summary, recomputed whenever the doc changes. */
  summary: AssessmentSummary;
  /** Risk register (worst-first), recomputed whenever the doc changes. */
  register: RiskRegisterEntry[];
  /**
   * True once the client has hydrated and is reading persisted state. Until then
   * the UI shows a stable placeholder so server and client HTML match.
   */
  ready: boolean;
  /** Update a single control's response and persist. */
  setResponse: (controlId: string, response: ControlResponse) => void;
  /** Patch the org/assessor metadata and persist. */
  setMeta: (patch: Partial<Pick<AssessmentDocument, "orgName" | "assessorName">>) => void;
  /** Replace the entire document (used by import / load sample) and persist. */
  replaceDoc: (next: AssessmentDocument) => void;
  /** Load the seeded sample assessment. */
  loadSample: () => void;
  /** Clear all responses and persisted state (Start over). */
  resetAll: () => void;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

/*
 * A tiny external store wrapping the persisted assessment. Using
 * `useSyncExternalStore` (rather than a load-in-effect) gives us a clean,
 * hydration-safe split: the server snapshot is a stable empty document, the
 * client snapshot reads from localStorage, and React reconciles them on the
 * client without a hydration mismatch.
 */
type Listener = () => void;

const SERVER_DOC: AssessmentDocument = emptyAssessment();

let cachedDoc: AssessmentDocument | null = null;
let hydrated = false;
const listeners = new Set<Listener>();

function readClientDoc(): AssessmentDocument {
  if (cachedDoc === null) {
    cachedDoc = loadAssessment();
    hydrated = true;
  }
  return cachedDoc;
}

function emit() {
  for (const l of listeners) l();
}

function commit(next: AssessmentDocument) {
  cachedDoc = saveAssessment(next, new Date().toISOString());
  hydrated = true;
  emit();
}

const store = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): AssessmentDocument {
    return readClientDoc();
  },
  getServerSnapshot(): AssessmentDocument {
    return SERVER_DOC;
  },
  // Stable references for the `ready` flag so useSyncExternalStore does not
  // re-subscribe or see a new getter identity on every render.
  getIsHydrated(): boolean {
    return hydrated;
  },
  getIsHydratedServer(): boolean {
    return false;
  },
};

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const doc = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  // On the server snapshot we report not-ready; after the client reads storage
  // (which getSnapshot triggers) we are ready. Reuses the same `store.subscribe`
  // reference and stable getters to avoid duplicate subscription churn.
  const ready = useSyncExternalStore(
    store.subscribe,
    store.getIsHydrated,
    store.getIsHydratedServer,
  );

  const setResponse = useCallback(
    (controlId: string, response: ControlResponse) => {
      const current = readClientDoc();
      commit({
        ...current,
        responses: { ...current.responses, [controlId]: response },
      });
    },
    [],
  );

  const setMeta = useCallback(
    (patch: Partial<Pick<AssessmentDocument, "orgName" | "assessorName">>) => {
      commit({ ...readClientDoc(), ...patch });
    },
    [],
  );

  const replaceDoc = useCallback((next: AssessmentDocument) => commit(next), []);

  const loadSample = useCallback(() => commit(sampleAssessment()), []);

  const resetAll = useCallback(() => {
    clearAssessment();
    commit(emptyAssessment());
  }, []);

  const summary = useMemo(() => summarize(doc), [doc]);
  const register = useMemo(() => buildRegister(doc), [doc]);

  const value = useMemo<AssessmentContextValue>(
    () => ({
      doc,
      summary,
      register,
      ready,
      setResponse,
      setMeta,
      replaceDoc,
      loadSample,
      resetAll,
    }),
    [doc, summary, register, ready, setResponse, setMeta, replaceDoc, loadSample, resetAll],
  );

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment(): AssessmentContextValue {
  const ctx = useContext(AssessmentContext);
  if (!ctx) {
    throw new Error("useAssessment must be used within an AssessmentProvider");
  }
  return ctx;
}
