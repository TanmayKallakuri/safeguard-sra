import type { CategoryMeta, Control } from "./types";

/**
 * The HIPAA Security Rule control catalog.
 *
 * Source of truth: 45 CFR Part 164, Subpart C — "Security Standards for the
 * Protection of Electronic Protected Health Information" — and its Appendix A
 * (the Standards / Implementation Specifications matrix). Required vs Addressable
 * designations follow that matrix.
 *
 * This data is static and citation-bearing. It contains no protected health
 * information; the sample assessment elsewhere uses a fictional clinic.
 */

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "administrative",
    name: "Administrative Safeguards",
    citation: "45 CFR § 164.308",
    description:
      "Administrative actions, policies, and procedures to manage the selection, development, implementation, and maintenance of security measures to protect ePHI and to manage the conduct of the workforce.",
  },
  {
    id: "physical",
    name: "Physical Safeguards",
    citation: "45 CFR § 164.310",
    description:
      "Physical measures, policies, and procedures to protect electronic information systems and related buildings and equipment from natural and environmental hazards and unauthorized intrusion.",
  },
  {
    id: "technical",
    name: "Technical Safeguards",
    citation: "45 CFR § 164.312",
    description:
      "The technology and the policies and procedures for its use that protect ePHI and control access to it.",
  },
  {
    id: "organizational",
    name: "Organizational Requirements",
    citation: "45 CFR § 164.314",
    description:
      "Requirements for business associate contracts and other arrangements, and for group health plans, that extend safeguards across organizational boundaries.",
  },
  {
    id: "documentation",
    name: "Policies, Procedures & Documentation",
    citation: "45 CFR § 164.316",
    description:
      "Requirements to implement reasonable policies and procedures and to maintain written documentation of them, with defined retention, availability, and update obligations.",
  },
];

export const CONTROLS: Control[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // § 164.308 ADMINISTRATIVE SAFEGUARDS
  // ─────────────────────────────────────────────────────────────────────────

  // (a)(1) Security Management Process
  {
    id: "164.308(a)(1)(ii)(A)",
    citation: "45 CFR § 164.308(a)(1)(ii)(A)",
    category: "administrative",
    standardId: "164.308(a)(1)",
    standardName: "Security Management Process",
    name: "Risk Analysis",
    requirement: "required",
    description:
      "Conduct an accurate and thorough assessment of the potential risks and vulnerabilities to the confidentiality, integrity, and availability of ePHI held by the organization.",
    remediation:
      "Perform and document a formal risk analysis covering all systems that create, receive, maintain, or transmit ePHI. Inventory ePHI assets, identify threats and vulnerabilities, and rate likelihood and impact.",
  },
  {
    id: "164.308(a)(1)(ii)(B)",
    citation: "45 CFR § 164.308(a)(1)(ii)(B)",
    category: "administrative",
    standardId: "164.308(a)(1)",
    standardName: "Security Management Process",
    name: "Risk Management",
    requirement: "required",
    description:
      "Implement security measures sufficient to reduce risks and vulnerabilities to a reasonable and appropriate level.",
    remediation:
      "Establish a risk management process that prioritizes findings from the risk analysis and tracks remediation to completion with owners and target dates.",
  },
  {
    id: "164.308(a)(1)(ii)(C)",
    citation: "45 CFR § 164.308(a)(1)(ii)(C)",
    category: "administrative",
    standardId: "164.308(a)(1)",
    standardName: "Security Management Process",
    name: "Sanction Policy",
    requirement: "required",
    description:
      "Apply appropriate sanctions against workforce members who fail to comply with the security policies and procedures.",
    remediation:
      "Adopt and communicate a documented sanction policy with graduated consequences for security policy violations, and apply it consistently.",
  },
  {
    id: "164.308(a)(1)(ii)(D)",
    citation: "45 CFR § 164.308(a)(1)(ii)(D)",
    category: "administrative",
    standardId: "164.308(a)(1)",
    standardName: "Security Management Process",
    name: "Information System Activity Review",
    requirement: "required",
    description:
      "Implement procedures to regularly review records of information system activity, such as audit logs, access reports, and security incident tracking reports.",
    remediation:
      "Schedule and document regular reviews of audit logs and access reports. Define who reviews, how often, and how anomalies are escalated.",
  },

  // (a)(2) Assigned Security Responsibility (standard, no separate specs)
  {
    id: "164.308(a)(2)",
    citation: "45 CFR § 164.308(a)(2)",
    category: "administrative",
    standardId: "164.308(a)(2)",
    standardName: "Assigned Security Responsibility",
    name: "Assigned Security Responsibility",
    requirement: "required",
    description:
      "Identify the security official who is responsible for the development and implementation of the policies and procedures required by the Security Rule.",
    remediation:
      "Formally designate a named Security Official, document the role and its authority, and ensure the role is resourced.",
  },

  // (a)(3) Workforce Security
  {
    id: "164.308(a)(3)(ii)(A)",
    citation: "45 CFR § 164.308(a)(3)(ii)(A)",
    category: "administrative",
    standardId: "164.308(a)(3)",
    standardName: "Workforce Security",
    name: "Authorization and/or Supervision",
    requirement: "addressable",
    description:
      "Implement procedures for the authorization and/or supervision of workforce members who work with ePHI or in locations where it might be accessed.",
    remediation:
      "Define and document authorization/supervision procedures for roles with ePHI access. If not implemented, document the rationale and any equivalent measure.",
  },
  {
    id: "164.308(a)(3)(ii)(B)",
    citation: "45 CFR § 164.308(a)(3)(ii)(B)",
    category: "administrative",
    standardId: "164.308(a)(3)",
    standardName: "Workforce Security",
    name: "Workforce Clearance Procedure",
    requirement: "addressable",
    description:
      "Implement procedures to determine that the access of a workforce member to ePHI is appropriate.",
    remediation:
      "Establish clearance/background procedures appropriate to the sensitivity of the role before granting ePHI access.",
  },
  {
    id: "164.308(a)(3)(ii)(C)",
    citation: "45 CFR § 164.308(a)(3)(ii)(C)",
    category: "administrative",
    standardId: "164.308(a)(3)",
    standardName: "Workforce Security",
    name: "Termination Procedures",
    requirement: "addressable",
    description:
      "Implement procedures for terminating access to ePHI when a workforce member's employment ends or their access is no longer appropriate.",
    remediation:
      "Create a deprovisioning checklist that revokes accounts, badges, and credentials on termination or role change, with verification.",
  },

  // (a)(4) Information Access Management
  {
    id: "164.308(a)(4)(ii)(A)",
    citation: "45 CFR § 164.308(a)(4)(ii)(A)",
    category: "administrative",
    standardId: "164.308(a)(4)",
    standardName: "Information Access Management",
    name: "Isolating Health Care Clearinghouse Functions",
    requirement: "required",
    description:
      "If a clearinghouse is part of a larger organization, implement policies and procedures that protect ePHI of the clearinghouse from unauthorized access by the larger organization.",
    remediation:
      "If applicable, logically and procedurally isolate clearinghouse ePHI from the rest of the organization. If not a clearinghouse, mark Not Applicable.",
  },
  {
    id: "164.308(a)(4)(ii)(B)",
    citation: "45 CFR § 164.308(a)(4)(ii)(B)",
    category: "administrative",
    standardId: "164.308(a)(4)",
    standardName: "Information Access Management",
    name: "Access Authorization",
    requirement: "addressable",
    description:
      "Implement policies and procedures for granting access to ePHI, for example through access to a workstation, transaction, program, or process.",
    remediation:
      "Document a role-based access authorization process with defined approval steps before access to ePHI systems is granted.",
  },
  {
    id: "164.308(a)(4)(ii)(C)",
    citation: "45 CFR § 164.308(a)(4)(ii)(C)",
    category: "administrative",
    standardId: "164.308(a)(4)",
    standardName: "Information Access Management",
    name: "Access Establishment and Modification",
    requirement: "addressable",
    description:
      "Implement policies and procedures that establish, document, review, and modify a user's right of access to a workstation, transaction, program, or process.",
    remediation:
      "Implement periodic access reviews and a change process that adjusts entitlements when roles change. Retain review evidence.",
  },

  // (a)(5) Security Awareness and Training
  {
    id: "164.308(a)(5)(ii)(A)",
    citation: "45 CFR § 164.308(a)(5)(ii)(A)",
    category: "administrative",
    standardId: "164.308(a)(5)",
    standardName: "Security Awareness and Training",
    name: "Security Reminders",
    requirement: "addressable",
    description:
      "Provide periodic security updates and reminders to workforce members.",
    remediation:
      "Send recurring security reminders (phishing alerts, policy refreshers) and track distribution.",
  },
  {
    id: "164.308(a)(5)(ii)(B)",
    citation: "45 CFR § 164.308(a)(5)(ii)(B)",
    category: "administrative",
    standardId: "164.308(a)(5)",
    standardName: "Security Awareness and Training",
    name: "Protection from Malicious Software",
    requirement: "addressable",
    description:
      "Implement procedures for guarding against, detecting, and reporting malicious software.",
    remediation:
      "Deploy and maintain endpoint anti-malware, keep signatures/engines current, and train staff to report suspected malware.",
  },
  {
    id: "164.308(a)(5)(ii)(C)",
    citation: "45 CFR § 164.308(a)(5)(ii)(C)",
    category: "administrative",
    standardId: "164.308(a)(5)",
    standardName: "Security Awareness and Training",
    name: "Log-in Monitoring",
    requirement: "addressable",
    description:
      "Implement procedures for monitoring log-in attempts and reporting discrepancies.",
    remediation:
      "Enable monitoring and alerting on failed and anomalous log-in attempts, with defined escalation.",
  },
  {
    id: "164.308(a)(5)(ii)(D)",
    citation: "45 CFR § 164.308(a)(5)(ii)(D)",
    category: "administrative",
    standardId: "164.308(a)(5)",
    standardName: "Security Awareness and Training",
    name: "Password Management",
    requirement: "addressable",
    description:
      "Implement procedures for creating, changing, and safeguarding passwords.",
    remediation:
      "Adopt a password policy (length/complexity or passphrase + MFA), a secure reset process, and prohibit shared credentials.",
  },

  // (a)(6) Security Incident Procedures
  {
    id: "164.308(a)(6)(ii)",
    citation: "45 CFR § 164.308(a)(6)(ii)",
    category: "administrative",
    standardId: "164.308(a)(6)",
    standardName: "Security Incident Procedures",
    name: "Response and Reporting",
    requirement: "required",
    description:
      "Identify and respond to suspected or known security incidents; mitigate, to the extent practicable, harmful effects; and document incidents and their outcomes.",
    remediation:
      "Establish a documented incident response plan with roles, severity levels, containment/eradication steps, breach-assessment criteria, and an incident log.",
  },

  // (a)(7) Contingency Plan
  {
    id: "164.308(a)(7)(ii)(A)",
    citation: "45 CFR § 164.308(a)(7)(ii)(A)",
    category: "administrative",
    standardId: "164.308(a)(7)",
    standardName: "Contingency Plan",
    name: "Data Backup Plan",
    requirement: "required",
    description:
      "Establish and implement procedures to create and maintain retrievable exact copies of ePHI.",
    remediation:
      "Implement automated backups of all ePHI, verify restorability, and store copies securely (ideally offsite/immutable).",
  },
  {
    id: "164.308(a)(7)(ii)(B)",
    citation: "45 CFR § 164.308(a)(7)(ii)(B)",
    category: "administrative",
    standardId: "164.308(a)(7)",
    standardName: "Contingency Plan",
    name: "Disaster Recovery Plan",
    requirement: "required",
    description:
      "Establish (and implement as needed) procedures to restore any loss of data.",
    remediation:
      "Document a disaster recovery plan with recovery objectives (RTO/RPO), restoration steps, and assigned responsibilities.",
  },
  {
    id: "164.308(a)(7)(ii)(C)",
    citation: "45 CFR § 164.308(a)(7)(ii)(C)",
    category: "administrative",
    standardId: "164.308(a)(7)",
    standardName: "Contingency Plan",
    name: "Emergency Mode Operation Plan",
    requirement: "required",
    description:
      "Establish (and implement as needed) procedures to enable continuation of critical business processes for protection of the security of ePHI while operating in emergency mode.",
    remediation:
      "Define how critical ePHI-handling processes continue securely during an emergency or outage.",
  },
  {
    id: "164.308(a)(7)(ii)(D)",
    citation: "45 CFR § 164.308(a)(7)(ii)(D)",
    category: "administrative",
    standardId: "164.308(a)(7)",
    standardName: "Contingency Plan",
    name: "Testing and Revision Procedures",
    requirement: "addressable",
    description:
      "Implement procedures for periodic testing and revision of contingency plans.",
    remediation:
      "Test backups and recovery plans on a defined cadence (e.g., annually), capture results, and revise plans accordingly.",
  },
  {
    id: "164.308(a)(7)(ii)(E)",
    citation: "45 CFR § 164.308(a)(7)(ii)(E)",
    category: "administrative",
    standardId: "164.308(a)(7)",
    standardName: "Contingency Plan",
    name: "Applications and Data Criticality Analysis",
    requirement: "addressable",
    description:
      "Assess the relative criticality of specific applications and data in support of other contingency plan components.",
    remediation:
      "Rank applications and data by criticality to drive backup priority and recovery sequencing.",
  },

  // (a)(8) Evaluation (standard, no separate specs)
  {
    id: "164.308(a)(8)",
    citation: "45 CFR § 164.308(a)(8)",
    category: "administrative",
    standardId: "164.308(a)(8)",
    standardName: "Evaluation",
    name: "Evaluation",
    requirement: "required",
    description:
      "Perform a periodic technical and nontechnical evaluation, based initially on the standards implemented under the Security Rule and subsequently in response to environmental or operational changes affecting the security of ePHI.",
    remediation:
      "Conduct and document periodic security evaluations (at least annually and after major changes) and feed findings back into risk management.",
  },

  // (b) Business Associate Contracts and Other Arrangements
  {
    id: "164.308(b)(4)",
    citation: "45 CFR § 164.308(b)(4)",
    category: "administrative",
    standardId: "164.308(b)(1)",
    standardName: "Business Associate Contracts and Other Arrangements",
    name: "Written Contract or Other Arrangement",
    requirement: "required",
    description:
      "Document the satisfactory assurances required from a business associate through a written contract or other arrangement that meets the applicable requirements.",
    remediation:
      "Maintain executed Business Associate Agreements (BAAs) for every vendor that handles ePHI, and track them in a vendor inventory.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // § 164.310 PHYSICAL SAFEGUARDS
  // ─────────────────────────────────────────────────────────────────────────

  // (a)(1) Facility Access Controls
  {
    id: "164.310(a)(2)(i)",
    citation: "45 CFR § 164.310(a)(2)(i)",
    category: "physical",
    standardId: "164.310(a)(1)",
    standardName: "Facility Access Controls",
    name: "Contingency Operations",
    requirement: "addressable",
    description:
      "Establish procedures that allow facility access in support of restoration of lost data under the disaster recovery plan and emergency mode operations plan in the event of an emergency.",
    remediation:
      "Define how authorized staff gain facility access during recovery scenarios while preserving security controls.",
  },
  {
    id: "164.310(a)(2)(ii)",
    citation: "45 CFR § 164.310(a)(2)(ii)",
    category: "physical",
    standardId: "164.310(a)(1)",
    standardName: "Facility Access Controls",
    name: "Facility Security Plan",
    requirement: "addressable",
    description:
      "Implement policies and procedures to safeguard the facility and the equipment therein from unauthorized physical access, tampering, and theft.",
    remediation:
      "Document a facility security plan covering locks, alarms, visitor handling, and equipment protection.",
  },
  {
    id: "164.310(a)(2)(iii)",
    citation: "45 CFR § 164.310(a)(2)(iii)",
    category: "physical",
    standardId: "164.310(a)(1)",
    standardName: "Facility Access Controls",
    name: "Access Control and Validation Procedures",
    requirement: "addressable",
    description:
      "Implement procedures to control and validate a person's access to facilities based on their role or function, including visitor control and control of access to software programs for testing and revision.",
    remediation:
      "Implement badge/role-based facility access and visitor sign-in/escort procedures.",
  },
  {
    id: "164.310(a)(2)(iv)",
    citation: "45 CFR § 164.310(a)(2)(iv)",
    category: "physical",
    standardId: "164.310(a)(1)",
    standardName: "Facility Access Controls",
    name: "Maintenance Records",
    requirement: "addressable",
    description:
      "Implement policies and procedures to document repairs and modifications to the physical components of a facility which are related to security.",
    remediation:
      "Keep a log of security-relevant facility repairs and modifications (locks, doors, walls, hardware).",
  },

  // (b) Workstation Use (standard, no separate specs)
  {
    id: "164.310(b)",
    citation: "45 CFR § 164.310(b)",
    category: "physical",
    standardId: "164.310(b)",
    standardName: "Workstation Use",
    name: "Workstation Use",
    requirement: "required",
    description:
      "Implement policies and procedures that specify the proper functions to be performed, the manner in which they are performed, and the physical attributes of the surroundings of a specific workstation or class of workstation that can access ePHI.",
    remediation:
      "Publish an acceptable-use/workstation policy describing how and where ePHI-capable workstations may be used.",
  },

  // (c) Workstation Security (standard, no separate specs)
  {
    id: "164.310(c)",
    citation: "45 CFR § 164.310(c)",
    category: "physical",
    standardId: "164.310(c)",
    standardName: "Workstation Security",
    name: "Workstation Security",
    requirement: "required",
    description:
      "Implement physical safeguards for all workstations that access ePHI to restrict access to authorized users.",
    remediation:
      "Apply physical protections (privacy screens, cable locks, positioning, auto-lock) to workstations that access ePHI.",
  },

  // (d)(1) Device and Media Controls
  {
    id: "164.310(d)(2)(i)",
    citation: "45 CFR § 164.310(d)(2)(i)",
    category: "physical",
    standardId: "164.310(d)(1)",
    standardName: "Device and Media Controls",
    name: "Disposal",
    requirement: "required",
    description:
      "Implement policies and procedures to address the final disposition of ePHI, and/or the hardware or electronic media on which it is stored.",
    remediation:
      "Adopt secure media disposal/destruction procedures (wiping, shredding, certificates of destruction).",
  },
  {
    id: "164.310(d)(2)(ii)",
    citation: "45 CFR § 164.310(d)(2)(ii)",
    category: "physical",
    standardId: "164.310(d)(1)",
    standardName: "Device and Media Controls",
    name: "Media Re-use",
    requirement: "required",
    description:
      "Implement procedures for removal of ePHI from electronic media before the media are made available for re-use.",
    remediation:
      "Sanitize media to standards (e.g., NIST SP 800-88) before re-use, and record the action.",
  },
  {
    id: "164.310(d)(2)(iii)",
    citation: "45 CFR § 164.310(d)(2)(iii)",
    category: "physical",
    standardId: "164.310(d)(1)",
    standardName: "Device and Media Controls",
    name: "Accountability",
    requirement: "addressable",
    description:
      "Maintain a record of the movements of hardware and electronic media and any person responsible therefor.",
    remediation:
      "Track custody and movement of ePHI-bearing devices/media with an asset register.",
  },
  {
    id: "164.310(d)(2)(iv)",
    citation: "45 CFR § 164.310(d)(2)(iv)",
    category: "physical",
    standardId: "164.310(d)(1)",
    standardName: "Device and Media Controls",
    name: "Data Backup and Storage",
    requirement: "addressable",
    description:
      "Create a retrievable, exact copy of ePHI, when needed, before movement of equipment.",
    remediation:
      "Back up ePHI before relocating or servicing equipment, and verify the copy.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // § 164.312 TECHNICAL SAFEGUARDS
  // ─────────────────────────────────────────────────────────────────────────

  // (a)(1) Access Control
  {
    id: "164.312(a)(2)(i)",
    citation: "45 CFR § 164.312(a)(2)(i)",
    category: "technical",
    standardId: "164.312(a)(1)",
    standardName: "Access Control",
    name: "Unique User Identification",
    requirement: "required",
    description:
      "Assign a unique name and/or number for identifying and tracking user identity.",
    remediation:
      "Ensure every user has a unique account; eliminate shared/generic logins for systems with ePHI.",
  },
  {
    id: "164.312(a)(2)(ii)",
    citation: "45 CFR § 164.312(a)(2)(ii)",
    category: "technical",
    standardId: "164.312(a)(1)",
    standardName: "Access Control",
    name: "Emergency Access Procedure",
    requirement: "required",
    description:
      "Establish (and implement as needed) procedures for obtaining necessary ePHI during an emergency.",
    remediation:
      "Define break-glass procedures granting controlled emergency access to ePHI, with logging and review.",
  },
  {
    id: "164.312(a)(2)(iii)",
    citation: "45 CFR § 164.312(a)(2)(iii)",
    category: "technical",
    standardId: "164.312(a)(1)",
    standardName: "Access Control",
    name: "Automatic Logoff",
    requirement: "addressable",
    description:
      "Implement electronic procedures that terminate an electronic session after a predetermined time of inactivity.",
    remediation:
      "Enforce inactivity timeouts/auto-lock on systems and workstations that access ePHI.",
  },
  {
    id: "164.312(a)(2)(iv)",
    citation: "45 CFR § 164.312(a)(2)(iv)",
    category: "technical",
    standardId: "164.312(a)(1)",
    standardName: "Access Control",
    name: "Encryption and Decryption",
    requirement: "addressable",
    description:
      "Implement a mechanism to encrypt and decrypt ePHI.",
    remediation:
      "Encrypt ePHI at rest (full-disk and/or database/field-level) using current standards, and manage keys securely.",
  },

  // (b) Audit Controls (standard, no separate specs)
  {
    id: "164.312(b)",
    citation: "45 CFR § 164.312(b)",
    category: "technical",
    standardId: "164.312(b)",
    standardName: "Audit Controls",
    name: "Audit Controls",
    requirement: "required",
    description:
      "Implement hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use ePHI.",
    remediation:
      "Enable audit logging on ePHI systems, protect logs from tampering, and retain them per policy.",
  },

  // (c)(1) Integrity
  {
    id: "164.312(c)(2)",
    citation: "45 CFR § 164.312(c)(2)",
    category: "technical",
    standardId: "164.312(c)(1)",
    standardName: "Integrity",
    name: "Mechanism to Authenticate ePHI",
    requirement: "addressable",
    description:
      "Implement electronic mechanisms to corroborate that ePHI has not been altered or destroyed in an unauthorized manner.",
    remediation:
      "Use integrity mechanisms (checksums, hashing, digital signatures, version control) to detect unauthorized changes to ePHI.",
  },

  // (d) Person or Entity Authentication (standard, no separate specs)
  {
    id: "164.312(d)",
    citation: "45 CFR § 164.312(d)",
    category: "technical",
    standardId: "164.312(d)",
    standardName: "Person or Entity Authentication",
    name: "Person or Entity Authentication",
    requirement: "required",
    description:
      "Implement procedures to verify that a person or entity seeking access to ePHI is the one claimed.",
    remediation:
      "Require strong authentication (and MFA where feasible) before granting access to ePHI.",
  },

  // (e)(1) Transmission Security
  {
    id: "164.312(e)(2)(i)",
    citation: "45 CFR § 164.312(e)(2)(i)",
    category: "technical",
    standardId: "164.312(e)(1)",
    standardName: "Transmission Security",
    name: "Integrity Controls",
    requirement: "addressable",
    description:
      "Implement security measures to ensure that electronically transmitted ePHI is not improperly modified without detection until disposed of.",
    remediation:
      "Protect ePHI in transit against undetected modification (e.g., TLS, message integrity checks).",
  },
  {
    id: "164.312(e)(2)(ii)",
    citation: "45 CFR § 164.312(e)(2)(ii)",
    category: "technical",
    standardId: "164.312(e)(1)",
    standardName: "Transmission Security",
    name: "Encryption",
    requirement: "addressable",
    description:
      "Implement a mechanism to encrypt ePHI whenever deemed appropriate.",
    remediation:
      "Encrypt ePHI in transit (TLS for web/APIs, encrypted email/secure messaging) wherever it leaves a trusted network.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // § 164.314 ORGANIZATIONAL REQUIREMENTS
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "164.314(a)(2)(i)",
    citation: "45 CFR § 164.314(a)(2)(i)",
    category: "organizational",
    standardId: "164.314(a)(1)",
    standardName: "Business Associate Contracts or Other Arrangements",
    name: "Business Associate Contracts",
    requirement: "required",
    description:
      "The contract with a business associate must provide that the business associate will comply with the applicable security requirements, ensure subcontractors do the same, and report security incidents.",
    remediation:
      "Ensure BAAs contain the required security provisions (safeguards, subcontractor flow-down, and incident reporting).",
  },
  {
    id: "164.314(a)(2)(iii)",
    citation: "45 CFR § 164.314(a)(2)(iii)",
    category: "organizational",
    standardId: "164.314(a)(1)",
    standardName: "Business Associate Contracts or Other Arrangements",
    name: "Business Associate Contracts with Subcontractors",
    requirement: "required",
    description:
      "Require business associates, in their contracts with subcontractors that create, receive, maintain, or transmit ePHI, to apply the same applicable requirements.",
    remediation:
      "Confirm BAAs require subcontractor flow-down agreements with equivalent safeguards.",
  },
  {
    id: "164.314(b)(2)",
    citation: "45 CFR § 164.314(b)(2)",
    category: "organizational",
    standardId: "164.314(b)(1)",
    standardName: "Requirements for Group Health Plans",
    name: "Plan Document Safeguard Requirements",
    requirement: "required",
    description:
      "Where applicable, plan documents of a group health plan must require the plan sponsor to reasonably and appropriately safeguard ePHI it creates, receives, maintains, or transmits on behalf of the plan.",
    remediation:
      "If a group health plan applies, amend plan documents to require sponsor safeguards; otherwise mark Not Applicable.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // § 164.316 POLICIES, PROCEDURES & DOCUMENTATION
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "164.316(a)",
    citation: "45 CFR § 164.316(a)",
    category: "documentation",
    standardId: "164.316(a)",
    standardName: "Policies and Procedures",
    name: "Policies and Procedures",
    requirement: "required",
    description:
      "Implement reasonable and appropriate policies and procedures to comply with the standards, implementation specifications, and other requirements of the Security Rule.",
    remediation:
      "Maintain a current set of written security policies and procedures mapped to the Security Rule.",
  },
  {
    id: "164.316(b)(2)(i)",
    citation: "45 CFR § 164.316(b)(2)(i)",
    category: "documentation",
    standardId: "164.316(b)(1)",
    standardName: "Documentation",
    name: "Time Limit",
    requirement: "required",
    description:
      "Retain the required documentation for 6 years from the date of its creation or the date when it last was in effect, whichever is later.",
    remediation:
      "Set a 6-year retention schedule for security documentation and enforce it.",
  },
  {
    id: "164.316(b)(2)(ii)",
    citation: "45 CFR § 164.316(b)(2)(ii)",
    category: "documentation",
    standardId: "164.316(b)(1)",
    standardName: "Documentation",
    name: "Availability",
    requirement: "required",
    description:
      "Make documentation available to those persons responsible for implementing the procedures to which the documentation pertains.",
    remediation:
      "Ensure relevant staff can readily access the security policies and procedures that govern their work.",
  },
  {
    id: "164.316(b)(2)(iii)",
    citation: "45 CFR § 164.316(b)(2)(iii)",
    category: "documentation",
    standardId: "164.316(b)(1)",
    standardName: "Documentation",
    name: "Updates",
    requirement: "required",
    description:
      "Review documentation periodically, and update as needed, in response to environmental or operational changes affecting the security of ePHI.",
    remediation:
      "Review and update security documentation on a defined cadence and after significant changes; record review dates.",
  },
];

/** Total number of assessable controls in the catalog. */
export const CONTROL_COUNT = CONTROLS.length;
