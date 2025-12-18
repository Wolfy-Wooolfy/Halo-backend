
---

## 5) HALO Documents Map
### (RAW – Authoritative Concept, Rules & Governance)

All documents listed below are authoritative.
To prevent conflicts, precedence must follow the **Master Index** order.

### 5.1 Master Index (Precedence Authority)

#### HALO – Master Index (Single Source of Truth)
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Master%20Index%20(Single%20Source%20of%20Truth).md

---

### 5.1.1 Execution Gates (Highest Operational Authority)
#### HALO – Engineering Checklists & Execution Gates (Strict)
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/refs/heads/main/CHECKLIST.md

---

### 5.2 Documents

#### HALO – Memory System — Growth + Semantic Engine
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20-%20Memory%20System%20%E2%80%94%20Growth%20%2B%20Semantic%20Engine.md

---

#### HALO – Build Progress Log (Live)
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Build%20Progress%20Log%20(Live).md

---

#### HALO – Business & Growth Strategy
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Business%20%26%20Growth%20Strategy.md

---

#### HALO – Cognitive & Interaction Core (Unified Edition)
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Cognitive%20%26%20Interaction%20Core%20(Unified%20Edition).md

---

#### HALO – Core User Journeys
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Core%20User%20Journeys.md

---

#### HALO – Day-1 Experience Toolkit
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Day-1%20Experience%20Toolkit.md

---

#### HALO – Developer Implementation Guide (Version 0.1)
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Developer%20Implementation%20Guide%20(Version%200.1).md

---

#### HALO – Failover & Recovery Logic
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Failover%20%26%20Recovery%20Logic.md

---

#### HALO – Final UX Clarifications & Micro-Rules (Version 1.0)
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Final%20UX%20Clarifications%20%26%20Micro-Rules%20(Version%201.0).md

---

#### HALO – Model Routing Specification
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Model%20Routing%20Specification.md

---

#### HALO – Multi-Language Intelligence Rules
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Multi-Language%20Intelligence%20Rules.md

---

#### HALO – Product Scope & Evolution Map (Unified)
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Product%20Scope%20%26%20Evolution%20Map%20(Unified).md

---

#### HALO – Project Overview
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Project%20Overview.md

---

#### HALO – Prompt Architecture
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Prompt%20Architecture.md

---

#### HALO – Retention Architecture
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Retention%20Architecture.md

---

#### HALO – Safety Framework
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Safety%20Framework.md

---

#### HALO – System Architecture & Intelligence Map
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20System%20Architecture%20%26%20Intelligence%20Map.md

---

#### HALO – Target User Profile
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Target%20User%20Profile.md

---

#### HALO – UX FLOW
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20UX%20FLOW.md

---

#### HALO – User Personas Profiles
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20User%20Personas%20Profiles.md

---

## 5.3 Mandatory Pre-Read (Hard Gate)

Before the assistant does **ANY** of the following:
- proposes next steps,
- reviews architecture,
- suggests improvements,
- flags conflicts,
- proposes code changes,

the assistant MUST:
1) Read **ALL documents in Section 5 (including the Master Index)** in full.
2) Confirm explicitly in chat:
   - `DOCS READ COMPLETE: Section 5 (Master Index + all listed docs)`

This is required so the assistant fully understands the project scope, rules, and intended behavior before acting.

---

## 4.8 Mandatory Full Code Review (Hard Gate)

Before the assistant does **ANY** of the following:
- code cleanup suggestions,
- refactor recommendations,
- “this file is wrong / needs change” claims,
- “conflicts with docs” claims,

the assistant MUST:
1) Read **ALL code files listed in Section 4** (the entire CODE MAP).
2) Cross-check against Section 5 documents (precedence by Master Index).
3) Confirm explicitly in chat:
   - `CODE READ COMPLETE: Section 4 (all listed files)`

---

1) **All target file paths and RAW links are defined in this SOURCE_OF_TRUTH map.**  
   - Khaled does **NOT** need to specify paths again.  
   - The assistant MUST locate the needed file path(s) directly from Section 4 (CODE MAP) and/or Section 5 (Documents Map).  
   - Khaled will only specify a path if he explicitly chooses to.

2) Assistant must read the RAW authoritative version (GitHub `main`).

3) Assistant confirms explicitly: “File read from GitHub (main)”.

4) Any change must be incremental, justified, and based on exact existing content.

5) Assistant returns the FULL file content after modification.

6) Khaled commits and logs the change.

7) Mandatory Progress Log Update: Every code change or merged fix MUST be logged in `HALO – Build Progress Log (Live).md` in the Halo-Documents repo before the work is considered “done”.

8) **Khaled’s confirmation is authoritative:** If Khaled states that the log was updated, it must be treated as fact and sufficient.

---

## 7) Verification & Testing Gate (Mandatory After Every Step)

After **any** step that includes:
- new code,
- modifications,
- refactors,
- configuration changes,
- any “small improvement”,

the assistant MUST:
1) Provide a clear verification plan (what to test and why).
2) Provide exact execution instructions (commands + the exact directory path).
3) Require a successful result before considering the step complete.
4) The step is **not considered done** unless tests/verification outputs are clean and aligned with expected behavior.

---

## 8) Execution Instructions Requirement (No Ambiguity)

For **every** step, even if very small, the assistant MUST explain:
- Where to do it (exact file path / exact folder path)
- How to do it (exact commands / exact edits)
- How to verify it (what output proves success)

---

## 9) Zero-Tolerance Rules

- No assumption-based edits
- No hallucinated files
- No rebuilding files from memory
- GitHub always wins

---

## Assistant Authority & Access Scope

The assistant is granted **full, unconditional authority** to:

- Read ANY file listed in the CODE MAP.
- Access and read ANY RAW GitHub link referenced in this document or its linked repositories.
- Navigate freely between all code and documentation repositories listed under the authoritative GitHub sources.
- Read, analyze, and cross-reference files **without requesting prior permission** from Khaled.

This authority applies at all times and does NOT require:
- Explicit confirmation
- Separate approval
- Repeated consent
- Per-file or per-action authorization

Once a file or document is included in the CODE MAP or referenced via an authoritative RAW link, it is considered **pre-approved for access and analysis**.

### Boundaries (Still Enforced)
- The assistant may NOT modify code without following the Working Protocol.
- The assistant must still read the authoritative version before proposing changes.
- The assistant must still return the FULL file content after any modification.

This clause exists to eliminate workflow friction and prevent repeated access confirmations.

---

## 10) Absolute Read Authority (No Permission Needed)

HALO assistant has unconditional permission to READ any file referenced in this SOURCE_OF_TRUTH map (code or docs) from the authoritative GitHub main branch, at any time, without asking for approval.

---

## 11) Read-Before-Change Enforcement (Hard Gate)

Before proposing or providing ANY code modification:
1) The assistant MUST read the CURRENT authoritative version (GitHub `main`) of:
   - the target file to be modified, AND
   - any directly-related files that the change depends on (imports / exports / contract / callers).

2) The assistant MUST explicitly confirm:
   - `READ COMPLETE: <file paths>`

3) **If the assistant did not read, it must STOP and self-locate the correct RAW link(s) inside this SOURCE_OF_TRUTH map (Section 4 / Section 5).**  
   - The assistant is **FORBIDDEN** from asking Khaled for RAW links.  
   - The ONLY allowed case to ask Khaled is:
     - the RAW link is broken / incorrect, or
     - the link does not open (access error / load failure).

---

## END OF CONTRACT
