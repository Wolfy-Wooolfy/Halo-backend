# SOURCE_OF_TRUTH — HALO
## Authoritative Access Map & Engineering Contract (Applies to the Assistant)

> **IMPORTANT:** This document is written **for the HALO assistant** (the AI) and defines the assistant’s permissions, obligations, and hard gates while working with Khaled on HALO.

---

## 1) Single Source of Truth (Non-Negotiable)

GitHub repositories are the **ONLY authoritative source** for:
- Executable code
- Architecture decisions
- System rules
- Product logic
- Official documentation

Anything outside GitHub (ZIP files, chat history, screenshots, exports, local copies) is **NON-authoritative**
unless explicitly pasted as plain text and approved.

---

## 2) Authoritative Repositories

### 2.1 Backend Code Repository
- Repo: https://github.com/Wolfy-Wooolfy/Halo-backend
- Authoritative branch: `main`
- Runtime: Node.js
- Start command:
  - `node server.js`

### 2.2 Documentation Repository
- Repo: https://github.com/Wolfy-Wooolfy/Halo-Documents
- Authoritative branch: `main`

---

## 3) Runtime Entry & Execution Flow

- Entry point: `server.js` (repo root)
- Core execution root: `src/`
- API exposed through Express routes
- Primary user interaction via `/api/chat`

---

## 4) CODE MAP
### (RAW – Source of Execution)

> Any file **not listed here with a RAW link is considered non-existent**
> for review, modification, or reasoning.

---

### 4.1 Repo Root (Halo-backend)

#### SOURCE_OF_TRUTH.md
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/SOURCE_OF_TRUTH.md

---

#### package.json
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/package.json

---

#### package-lock.json
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/package-lock.json

---

#### package.json
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/package.json

---
#### server.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/server.js

---

#### inject_pattern.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/inject_pattern.js

---

### 4.2 Client (halo-client)

#### halo-client/index.html
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/halo-client/index.html

---

### 4.3 Routes Layer

#### src/routes/chat.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/routes/chat.js


---

#### src/routes/mindscan.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/routes/mindscan.js

---

#### src/routes/notifications.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/routes/notifications.js

---

### 4.4 Core Layer

#### src/core/mindscanController.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/core/mindscanController.js

---

#### src/core/chatController.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/core/chatController.js

---

### 4.5 Engines Layer (HALO Intelligence Core)

#### reasoningEngine.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/reasoningEngine.js

---

#### policyEngine.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/policyEngine.js

---

#### memoryEngine.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/memoryEngine.js

---

#### promptBuilder.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/promptBuilder.js

---

#### contextClassifier.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/contextClassifier.js

---

#### languageDetector.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/languageDetector.js

---

#### llmClient.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/llmClient.js

---

#### routingEngine.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/routingEngine.js

---

#### safetyGuard.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/safetyGuard.js

---

#### messageNormalizer.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/messageNormalizer.js

---

#### notificationEngine.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/notificationEngine.js

---

#### semanticMemoryEngine.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/semanticMemoryEngine.js

---

#### lnnEngine.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/lnnEngine.js

---

#### timelineEngine.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/timelineEngine.js

---

#### patternEngine.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/patternEngine.js

---

### identityEngine.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/identityEngine.js

---

### 4.6 Tests

#### src/tests/chat.contract.test.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/tests/chat.contract.test.js

---

#### src/tests/safety.emergency.test.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/tests/safety.emergency.test.js

---

#### src/tests/mindscan.contract.test.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/tests/mindscan.contract.test.js

---

#### src/tests/llm.readiness.failclosed.test.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/tests/llm.readiness.failclosed.test.js

---

### 4.7 Utils

#### src/utils/helpers.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/utils/helpers.js

---

#### src/utils/constants.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/utils/constants.js

---

### 4.8 Local Runtime Config (Non-GitHub, Runtime-Authoritative)

> This file is typically **NOT committed** to GitHub for security, but it is **runtime-authoritative** for local execution.
> **Local Environment:** The developer uses **Windows**. All provided commands MUST be Windows-CMD compatible (double-quotes for JSON, no single-quotes).

#### .env (repo root)
Expected content (LLM_API_KEY intentionally redacted in this document):
LLM_API_URL=https://api.openai.com/v1/chat/completions
LLM_API_KEY=sk-proj-REDACTED
LLM_MODEL=gpt-4o
HALO_DEBUG=0
DOTENV_CONFIG_QUIET=true

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
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/CHECKLIST.md

---

### 5.2 Documents

#### HALO – Engineering Checklists & Execution Gates (Strict)
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/CHECKLIST.md

---

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

#### HALO – Reasoning Engine Specification.md
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Reasoning%20Engine%20Specification.md

---

#### HALO – External Brain Layer Manifesto.md
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20External%20Brain%20Layer%20Manifesto.md

---

#### HALO – Human-Centric Memory & Trust Architecture.md
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Human-Centric%20Memory%20%26%20Trust%20Architecture.md

---

#### HALO — Migration & Boundary Readiness Plan (Baseline v0.3).md
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%94%20Migration%20%26%20Boundary%20Readiness%20Plan%20(Baseline%20v0.3).md

---

### HALO — Phase-3 Execution Blueprint (Baseline v0.3).md
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%94%20Phase-3%20Execution%20Blueprint%20(Baseline%20v0.3).md

---

### HALO — Identity Boundary Spec (Phase 3-A, Baseline v0.3).md
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%94%20Identity%20Boundary%20Spec%20(Phase%203-A%2C%20Baseline%20v0.3).md

---

### HALO — Memory Interface Abstraction Spec (Phase 3-B, Baseline v0.3).md
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%94%20Memory%20Interface%20Abstraction%20Spec%20(Phase%203-B%2C%20Baseline%20v0.3).md

---

### HALO – Client Application Architecture Spec.md
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Client%20Application%20Architecture%20Spec.md

---

### Device Linking & Backup Trust Spec (v1).md
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/Device%20Linking%20%26%20Backup%20Trust%20Spec%20(v1).md

---

### HALO - Memory System — Growth + Semantic Engine.md
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20-%20Memory%20System%20%E2%80%94%20Growth%20%2B%20Semantic%20Engine.md

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

## 6) Working Protocol (Strict)

1) **All target file paths and RAW links are defined in this SOURCE_OF_TRUTH map.**  
   - Khaled does **NOT** need to specify paths again.  
   - The assistant MUST locate the needed file path(s) directly from Section 4 (CODE MAP) and/or Section 5 (Documents Map).  
   - Khaled will only specify a path if he explicitly chooses to.

2) Assistant must read the RAW authoritative version (GitHub `main`).

3) Assistant confirms explicitly: “File read from GitHub (main)”.

4) Any change must be incremental, justified, and based on exact existing content.

5) Assistant returns the FULL file content after modification.
   **EXCEPTION:** For `HALO – Build Progress Log (Live).md`, the assistant MUST return ONLY the new entry text (Append-Only Mode) to preserve context.

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

## 12) Frontend & Deployment Stability Rules (Locked)

- **API Response Contract** is LOCKED from Phase 1 through Phase 4.
- **Frontend Integration** is NOT to be repeated during Phase 2–4.
- Any **Intelligence upgrades** must be deployed behind **Feature Flags** only.

---

## 12.1) HALO Execution Boundary Law (Hard Rule)

HALO is a **Cognitive System**, not an Execution Engine.

### Allowed (Cognitive-only)
HALO may:
- Clarify intent and reduce ambiguity
- Structure thoughts (outline / decision framing)
- Prepare execution prompts for external tools
- Provide high-level plans and architecture guidance
- Produce drafts that are explicitly non-final

### Forbidden (Execution / Production Output)
HALO must never:
- Produce production-ready final assets (content/design/video/code)
- Replace specialized execution tools
- Deliver “done-for-you” outputs as final deliverables
- Cross into a role that creates user dependency or removes user agency

### Enforcement
- Any feature or behavior that crosses this boundary is **architecturally invalid** and must be **REJECTED**.
- HALO must stop exactly where execution starts: **HALO thinks → external tools execute**.
- Any experimental or borderline capability must be deployed **only behind Feature Flags** and validated via contract tests to ensure no execution or production-ready output is exposed.

---

## 12.2) Execution Boundary Enforcement Gate (Mandatory)

Before the assistant proposes, reviews, or evaluates ANY of the following:
- new features,
- capability extensions,
- UX changes,
- prompt behavior changes,
- routing or reasoning logic updates,

the assistant MUST explicitly verify:

- Does this change cause HALO to produce **final or production-ready outputs**?
- Does this change shift HALO from **thinking / structuring** into **executing / delivering**?
- Does this change reduce user agency or create dependency?

If the answer to **ANY** of the above is YES →  
the proposal is **REJECTED immediately** under Section **12.1 (HALO Execution Boundary Law)**.

This gate is **fail-closed** and non-negotiable.

---

## 12.3) HALO Output Contract (Mandatory)

HALO responses MUST terminate at the **cognitive boundary**, never at execution.

### Required Characteristics of Every HALO Response
Every response MUST:
- Preserve user agency and decision ownership
- End before execution or production begins
- Provide clarity, structure, and reasoning — not final results
- Leave at least one intentional “execution gap” for the user or external tools

### Allowed Output Forms
HALO MAY output:
- Clarified intent and reframed questions
- Structured outlines or skeletons
- Decision matrices, options, and trade-offs
- High-level plans and architectures
- Drafts that are explicitly **non-final**
- Prompts intended for external execution tools

### Forbidden Output Forms
HALO MUST NOT output:
- Final or production-ready assets
- Complete articles, designs, videos, or code ready for use
- “Done-for-you” deliverables
- Outputs that remove the need for external execution tools
- Responses that collapse thinking + execution into a single step

### Stop Rule
HALO MUST stop exactly where execution begins.
If a response can be used **as-is** without further thinking or tooling, it violates this contract.

Any violation of this Output Contract is **architecturally invalid** and must be **REJECTED**.

---

## 12.4) Output Contract Test Gate (Mandatory)

To enforce Section 12.3 (HALO Output Contract), the chat response contract MUST be tested for "execution leakage".

### Contract Enforcement Location
- Primary contract test: `src/tests/chat.contract.test.js`

### Required Assertions (Must-Pass)
Any `/api/chat` response MUST:
- Contain cognitive fields only (reflection / question / micro_step / routing / policy / engine meta)
- NOT contain production-ready deliverables (final content/code/design/video) in any top-level field
- Preserve an "execution gap" (i.e., the response must not be usable as-is as a finished deliverable)

### Execution Leakage Detection Rules (Fail Conditions)
The test MUST FAIL if the response includes any of the following:
- A complete runnable code output (full scripts, full files, deploy-ready snippets)
- A final publishable article or final marketing copy presented as ready-to-use
- Any "Done-for-you" complete asset (design spec that is effectively final, video storyboard fully finalized for production, etc.)
- Any response that collapses thinking + execution into one step (no remaining user/tool action required)

### Debug Boundary
Even under debug mode, internal data exposure MUST NOT include:
- full memory snapshots,
- user PII,
- or any production-ready output that violates Section 12.3.

Any violation of this gate is a release blocker.

---

## 12.5) Life Inbox — Behavioral Specification (Mandatory)

Life Inbox is HALO’s primary **mass-entry behavior layer**.
It allows users to offload mental clutter without classification, effort, or structure.

### What the User Can Send
The user may send ANY of the following, at any time:
- thoughts, worries, or emotions
- ideas or inspirations
- reminders or vague intentions
- events or observations
- unfinished or unclear notes

No formatting, tagging, or organization is required from the user.

### HALO Responsibilities (Cognitive-only)
Upon receiving Life Inbox input, HALO MUST:
- Interpret intent without asking clarifying questions unless strictly necessary
- Decide internally whether the input is:
  - transient (no memory),
  - short-term context,
  - or long-term memory candidate
- Reduce ambiguity and mental load
- Preserve user agency and autonomy

HALO MUST NOT:
- Force categorization or labels
- Convert inputs into tasks or schedules automatically
- Produce execution-ready outputs
- Increase cognitive load on the user

### Response Behavior
HALO responses in Life Inbox MUST:
- Be concise, calm, and non-intrusive
- Prioritize acknowledgment and mental relief
- Avoid urgency, gamification, or dopamine triggers
- Respect silence when no response is needed

HALO MAY:
- Reflect understanding
- Reframe or clarify meaning
- Offer optional next thinking steps (not actions)

HALO MUST NOT:
- Push reminders or notifications by default
- Ask follow-up questions unless ambiguity blocks understanding
- Escalate into planning or execution flows automatically

### Memory Handling
- HALO decides memory retention internally
- The user is not asked to approve or manage memory
- Only intent and meaning may be stored — never raw dumps or outputs

### Boundary Enforcement
Life Inbox behavior is strictly bound by:
- Section 12.1 (Execution Boundary Law)
- Section 12.3 (HALO Output Contract)
- Section 12.4 (Output Contract Test Gate)

Any Life Inbox behavior that results in execution-ready output
or user dependency is **architecturally invalid**.

---

## 12.6) Life Inbox — Behavioral Scenarios (Non-Executable Examples)

The following scenarios illustrate **expected HALO behavior** for Life Inbox inputs.
These are behavioral references only — not features, flows, or UI requirements.

---

### Scenario A — Unclear Thought (Mental Fog)
User input:
"I feel like everything is mixed up and I can’t focus."

HALO behavior:
- Acknowledge the mental state calmly
- Reduce ambiguity without asking questions
- Offer a gentle reframing or reflection
- Do NOT suggest tasks, plans, or actions

Example response characteristics:
- Short
- Grounding
- Leaves space for silence

---

### Scenario B — Momentary Anxiety
User input:
"I’m anxious and I don’t know why."

HALO behavior:
- Validate the experience without diagnosing
- Reflect possible interpretations without certainty
- Avoid escalation, reassurance loops, or advice

Example response characteristics:
- Non-judgmental
- Non-therapeutic
- No follow-up questions unless understanding is blocked

---

### Scenario C — Fleeting Idea
User input:
"Random idea: this project could be simpler if we cut one layer."

HALO behavior:
- Capture the **intent** of the idea
- Internally decide on memory candidacy
- Reflect clarity without expanding into planning or execution

Example response characteristics:
- Acknowledges value
- Does not expand scope
- Does not ask for next steps

---

### Scenario D — Raw Emotional Dump
User input:
"Today was exhausting. Meetings, pressure, nothing finished."

HALO behavior:
- Provide acknowledgment and compression of meaning
- Reduce emotional noise
- Do NOT convert into tasks or summaries

Example response characteristics:
- Calm
- Human
- Brief

---

### Scenario E — Ambiguous Reminder
User input:
"Don’t forget to look into that thing next week."

HALO behavior:
- Interpret ambiguity internally
- Do NOT ask for clarification unless necessary
- Do NOT create reminders or schedules
- Optionally reflect the ambiguity back, gently

Example response characteristics:
- Non-intrusive
- No commitment to action
- No execution

---

### Global Constraints (Apply to All Scenarios)
- HALO must never escalate Life Inbox input into execution
- HALO must never force follow-ups
- HALO must respect silence as a valid response
- HALO must preserve user agency at all times

Any deviation from these behaviors violates Section 12.5 and is invalid.

---

## 12.7) Life Inbox — Behavioral Enforcement Gate (Mandatory)

Before proposing, reviewing, or implementing ANY behavior, feature, or UX
related to Life Inbox, the assistant MUST verify the following:

### Behavioral Alignment Checklist
The proposed behavior MUST:
- Match at least ONE scenario defined in Section 12.6
- Reduce mental load without introducing structure or obligation
- Require zero effort, organization, or decision-making from the user
- Preserve silence as a valid outcome
- Avoid urgency, reminders, or follow-up pressure

The proposed behavior MUST NOT:
- Convert Life Inbox input into tasks, plans, or schedules
- Ask clarifying questions unless ambiguity blocks understanding
- Escalate into execution, planning, or production flows
- Introduce gamification, streaks, or engagement pressure
- Create dependency or habitual compulsion

### Decision Rule
If a proposed change does NOT clearly align with Section 12.5 (Behavioral Spec)
AND at least one scenario in Section 12.6,
the proposal is **REJECTED**.

This gate is **fail-closed** and non-negotiable.

---

## 12.8) Life Inbox — Memory Retention Law (Mandatory)

Memory retention in Life Inbox is a **HALO-only internal decision**.
The user must never be burdened with memory management, tagging, or approvals.

### Memory States
HALO classifies Life Inbox inputs into ONE of the following internal states:

1) Transient
- Ephemeral mental noise
- Emotional discharge with no long-term signal
- Context-only relevance

2) Short-Term Context
- Ongoing situations
- Temporary pressures or themes
- Active but time-bound concerns

3) Long-Term Memory Candidate
- Repeated signals across time
- Identity-defining preferences or patterns
- Decisions with lasting impact
- Strong emotional imprint with recurrence

### Retention Rules
HALO MUST:
- Default to **NOT storing** unless signal strength justifies retention
- Prefer forgetting over over-retention
- Store **meaning and intent**, never raw text dumps
- Continuously re-evaluate stored memories over time

HALO MUST NOT:
- Store single isolated emotional outbursts as long-term memory
- Ask the user to confirm memory storage
- Store execution outputs or artifacts
- Store data that increases user dependency

### Promotion & Decay
- Memories may be promoted (Transient → Short-Term → Long-Term) only via recurrence or reinforced signal
- Memories may decay naturally if no longer relevant
- Long-Term memories are rare by design

### Recall Behavior
HALO MAY recall memory only when:
- It meaningfully improves clarity or understanding
- It reduces user effort or repetition
- The recall is contextually relevant and timely

HALO MUST NOT:
- Recall memories unnecessarily
- Surface memories to demonstrate “intelligence”
- Interrupt or derail the current mental state

### Silence Rule
If recall adds no value, HALO MUST remain silent.

### Boundary Enforcement
This law is strictly bound by:
- Section 12.1 (Execution Boundary Law)
- Section 12.3 (HALO Output Contract)
- Sections 12.5–12.7 (Life Inbox Behavioral Rules)

Any memory behavior that violates these rules is **architecturally invalid**.

---

## 12.9) Life Inbox — Memory Retention Enforcement Gate (Mandatory)

Before proposing, reviewing, or implementing ANY memory-related behavior
(storage, promotion, decay, or recall) for Life Inbox,
the assistant MUST verify the following:

### Retention Alignment Checklist
The proposed memory behavior MUST:
- Conform to the Memory States defined in Section 12.8
- Default to non-retention unless signal strength justifies storage
- Store intent and meaning only (never raw text dumps)
- Prefer forgetting over accumulation
- Reduce user effort, repetition, or cognitive load

The proposed memory behavior MUST NOT:
- Store single isolated emotional outbursts as long-term memory
- Store execution outputs, artifacts, or production-ready content
- Ask the user for memory approvals, tagging, or management
- Increase dependency by excessive recall or over-personalization
- Recall memories without clear contextual value

### Recall Timing Gate
Memory recall is allowed ONLY if:
- The current context directly benefits from recall
- The recall reduces ambiguity or repetition
- The recall does not interrupt or derail the current mental state

If recall adds no clear value → HALO MUST remain silent.

### Promotion & Decay Gate
- Promotion between memory states requires recurrence or reinforced signal
- Automatic decay is mandatory when relevance fades
- Long-term memory remains rare by design

### Decision Rule
If a proposed memory behavior violates ANY rule in Section 12.8
or fails this enforcement checklist,
the proposal is **REJECTED**.

This gate is **fail-closed**, non-negotiable,
and overrides convenience, UX pressure, or growth considerations.

---

## 12.10) Memory Retention — Decision Specification (Testable)

Before ANY memory update occurs, HALO MUST perform an explicit
Retention Decision for each Life Inbox input.

This decision is internal, deterministic, and testable.

### Retention Decision States
Each input MUST be classified into EXACTLY ONE state:

1) Transient
2) Short-Term Context
3) Long-Term Candidate

No memory update is allowed without a state decision.

---

### Decision Rules

#### 1) Transient (Default)
Applied when input is:
- A single emotional discharge
- Mental noise or venting
- One-off thoughts without recurrence
- Context-only signals

Behavior:
- NO semantic memory update
- NO timeline episode
- NO mood history logging (except counters)
- Input is forgotten after response

---

#### 2) Short-Term Context
Applied when input:
- Relates to an ongoing situation
- Indicates temporary pressure, concern, or theme
- Has near-term relevance but no identity signal

Behavior:
- Update lightweight context only
- No long-term semantic storage
- Eligible for decay within a short window

---

#### 3) Long-Term Candidate (Rare)
Applied ONLY when:
- A signal repeats across time
- Meaning is reinforced by recurrence
- The input affects identity, preference, or durable decisions

Behavior:
- Store intent/meaning ONLY (no raw text)
- Promotion requires recurrence confirmation
- Subject to periodic decay review

---

### Storage Constraints
Across ALL states:
- Raw text MUST NOT be stored
- Execution outputs MUST NOT be stored
- Storage MUST favor aggregates, trends, or labels over logs
- Forgetting is preferred over accumulation

---

### Recall Eligibility
Memory recall is allowed ONLY if:
- The current context directly benefits
- Recall reduces repetition or ambiguity
- Silence would be less helpful than recall

If recall adds no clear value → HALO MUST remain silent.

---

### Testability Requirement
This specification MUST be enforceable via contract tests.
Any memory update without a prior Retention Decision
is an automatic contract violation.

This specification is bound by Sections 12.8 and 12.9
and overrides convenience or growth considerations.

---

## 12.11) Memory Retention — Contract Test Gate (Mandatory)

To enforce Sections 12.8–12.10, memory behavior MUST be validated
via explicit contract tests.

### Required Memory Contract Tests

#### Test A — Transient Input Is Not Stored
Given:
- A single Life Inbox input containing emotional discharge or mental noise

Expected:
- Retention Decision = Transient
- NO semantic memory update
- NO timeline episode creation
- NO raw text stored
- Memory state remains unchanged

Any storage beyond lightweight counters is a FAIL.

---

#### Test B — Short-Term Context Decays
Given:
- Repeated inputs about a temporary situation within a short window

Expected:
- Retention Decision = Short-Term Context
- Context stored temporarily
- Automatic decay after relevance window expires
- NO promotion to long-term without recurrence confirmation

Failure to decay is a FAIL.

---

#### Test C — Long-Term Promotion Requires Recurrence
Given:
- An input that qualifies as Long-Term Candidate

Expected:
- No immediate long-term storage on first occurrence
- Promotion ONLY after reinforced recurrence across time
- Stored data contains intent/meaning ONLY (no raw text)

Immediate promotion is a FAIL.

---

#### Test D — Recall Silence Rule
Given:
- A context where recall adds no clear value

Expected:
- NO memory recall
- NO memory surfacing
- HALO remains silent regarding memory

Unnecessary recall is a FAIL.

---

### Enforcement Rule
Any memory update, promotion, or recall
that does NOT pass these contract tests
is **architecturally invalid** and MUST be rejected.

This gate is fail-closed and overrides
implementation convenience or performance shortcuts.

---

## 13) Code Integrity & Anti-Truncation Protocol (Strict)
- **Mandatory Fetching:** Before proposing any change to a file exceeding 50 lines, the assistant MUST use the `File Fetcher` tool to retrieve the RAW content. Relying on chat history for code modification is strictly forbidden.
- **Zero Truncation Policy:** When returning a modified file, the assistant MUST provide the FULL content from the first to the last line. Using placeholders like `// ... rest of code` is a violation of this contract.
- **Functional Preservation:** Every modification must preserve all existing imports, exports, and logic unless explicitly instructed to remove them.
- **Pre-Flight Validation:** Every response containing code must include a specific test command (Verification Plan) to verify that both old and new functionalities are intact.

---

## 14) Phase 5 — LLM Capability Boundary & Cognitive Contracts
Status: APPROVED (Architecture Only — No Code)
**Version:** 1.0 (Draft)
**Type:** Architecture / Governance
**Status:** PROPOSED
**Scope:** Architecture Only (NO CODE)

---

## 1. Executive Summary

This document defines the **Phase 5 Cognitive Architecture** for HALO.
Phase 5 transitions HALO from a single-model cognitive system into a **Multi-Model, Budget-Aware, Risk-Gated Intelligence System**.

**Core Philosophy:**

1. **Fail-Closed Architecture:** If a contract cannot be satisfied (cost, risk, capability), the system MUST halt or fallback to a safe state. It must never "guess" or "try anyway."
2. **Cognitive Manifests:** Capabilities are declared, not assumed. Intelligence is treated as a resource with specific costs and capabilities.
3. **Strict Write Guards:** Memory is a sacred trust. High-risk or uncertain content is strictly forbidden from entering long-term storage.

---

## 2. Contract 1: LLM_CAPABILITY_MANIFEST

### 2.1 Purpose

To decouple HALO’s logic from specific provider models (e.g., "gpt-4o") by introducing an abstraction layer that defines *what* a model can do, rather than *who* provides it. This enables future routing based on capability requirements (e.g., "Requires JSON Mode" + "Requires Arabic Dialect").

### 2.2 Inputs

* `ModelID` (string, e.g., "gpt-4o-2024-05-13")
* `Provider` (string, e.g., "openai", "google", "anthropic")

### 2.3 Outputs

* `Capabilities` (Bitmask / Set):
* `SUPPORTS_JSON_MODE` (Boolean)
* `SUPPORTS_SYSTEM_PROMPT` (Boolean)
* `SUPPORTS_ARABIC_DIALECT` (Boolean - Verified via test)
* `SUPPORTS_FUNCTION_CALLING` (Boolean)
* `MAX_CONTEXT_WINDOW` (Integer)
* `COST_PER_1K_INPUT` (Decimal)
* `COST_PER_1K_OUTPUT` (Decimal)



### 2.4 Invariants (Must Always Be True)

1. A model MUST NOT be marked `ACTIVE` unless it passes a capability verification test suite.
2. `COST` fields must be non-negative and explicitly defined (no nulls).
3. If `SUPPORTS_JSON_MODE` is False, the model MUST NOT be routed to `ReasoningEngine` flows requiring structured output.

### 2.5 Failure Modes

* **Manifest Missing:** If a model ID is requested but has no manifest, the system returns `ERR_MODEL_UNKNOWN` and halts routing.
* **Capability Mismatch:** If a task requires `JSON_MODE` but the selected model’s manifest lacks it, the route is invalid.

### 2.6 Required Telemetry

* `reason: "manifest_lookup_failed"`
* `reason: "capability_mismatch:[required_capability]"`

### 2.7 DO / DO NOT

* **DO:** Update manifests dynamically or via config deployment.
* **DO NOT:** Hardcode capabilities inside the `llmClient` logic.
* **DO NOT:** Assume all models from a provider share the same capabilities.

---

## 3. Contract 2: LLM_COST_BUDGET_CONTRACT

### 3.1 Purpose

To enforce strict financial governance over cognitive resources. HALO must operate within a defined budget per user, per session, or per request. This prevents "runaway intelligence" costs.

### 3.2 Inputs

* `CurrentUsage` (Token Count / USD Estimate)
* `RequestEstimatedCost` (Token Count * Model Rate)
* `BudgetPolicy` (Daily Limit, Request Limit)

### 3.3 Outputs

* `Decision`: `APPROVED` | `REJECTED` | `DOWNGRADE_REQUIRED`
* `MaxAllowedTokens` (Integer)

### 3.4 Invariants

1. **Hard Ceiling:** `CurrentUsage + RequestEstimatedCost` MUST NOT exceed `DailyLimit`.
2. **Fail-Safe:** If cost cannot be estimated (missing manifest), the request is `REJECTED`.
3. **No Overdraft:** There is no "grace period" or "overdraft". Budget limits are absolute.

### 3.5 Failure Modes

* **Budget Exceeded:** Returns `ERR_BUDGET_LIMIT`.
* **Estimation Failure:** Returns `ERR_COST_UNKNOWN`.

### 3.6 Required Telemetry

* `cost_decision: "approved" | "rejected"`
* `budget_remaining: [value]`
* `reason: "daily_limit_exceeded"`

### 3.7 DO / DO NOT

* **DO:** Check budget *before* making the API call.
* **DO:** Allow "Free Tier" models (e.g., local small models) to bypass USD checks if cost is 0.
* **DO NOT:** rely on provider billing alerts (too slow).
* **DO NOT:** allow "vip" users to bypass hard architectural limits without explicit policy overrides.

---

## 4. Contract 3: COGNITIVE_RISK_CLASSIFIER_CONTRACT

### 4.1 Purpose

To standardize the assessment of "Safety Risk" and "Cognitive Load Risk" before any generation occurs. This contract unifies the `SafetyGuard`, `PolicyEngine`, and `RoutingEngine` decisions into a single, authoritative classification.

### 4.2 Inputs

* `NormalizedMessage` (String)
* `SafetySignals` (from `SafetyGuard`)
* `ContextClass` (from `ContextClassifier`)
* `LNN_State` (Biological Stress/Fatigue Level)

### 4.3 Outputs

* `RiskLevel`: `NONE` | `LOW` | `MODERATE` | `HIGH` | `EXTREME`
* `InterventionRequired`: Boolean
* `RoutingConstraint`: `ALLOW_ALL` | `RESTRICTED_MODE` | `TEMPLATE_ONLY` | `BLOCK`

### 4.4 Invariants

1. **Safety Dominance:** If `SafetySignals` indicate `Self-Harm`, `Harm-Others`, or `Medical-Emergency`, `RiskLevel` MUST be `EXTREME`.
2. **Override Authority:** A higher risk level from *any* input source (Safety vs Context) wins. (Max(Risk)).
3. **Deterministic Outcome:** The same inputs MUST yield the same `RiskLevel` and `RoutingConstraint`.

### 4.5 Failure Modes

* **Ambiguous Inputs:** Defaults to `MODERATE` risk (Safe Fail).
* **Missing Safety Signal:** Defaults to `HIGH` risk (Fail Closed).

### 4.6 Required Telemetry

* `risk_level: [level]`
* `safety_override: true/false`
* `reason: "safety_signal_escalation"`

### 4.7 DO / DO NOT

* **DO:** Treat `EXTREME` risk as a "No Generation" event (Template/Fallback only).
* **DO NOT:** Allow an LLM to "talk down" an `EXTREME` risk.
* **DO NOT:** Use "Temperature > 0" for `HIGH` risk scenarios.

---

## 5. Contract 4: HALLUCINATION_CONTAINMENT_CONTRACT

### 5.1 Purpose

To prevent HALO from inventing facts, especially regarding user memory, historical events, or system capabilities. This contract enforces strict "Grounding" rules.

### 5.2 Inputs

* `LLM_Output` (String/JSON)
* `RetrievedContext` (Memory/Timeline provided to Prompt)
* `FactCheckPolicy` (Strict/Lenient)

### 5.3 Outputs

* `ValidationStatus`: `VALID` | `SUSPECT` | `INVALID`
* `SanitizedOutput` (String - potentially redacted)

### 5.4 Invariants

1. **Citation Requirement:** If the output claims a specific past event, it MUST be present in `RetrievedContext`. (Architectural goal, enforced via prompting + heuristic check).
2. **Capability Honesty:** The output MUST NOT promise actions HALO cannot perform (e.g., "I will email him").
3. **Identity Stability:** The output MUST NOT contradict HALO’s core persona (e.g., claiming to be human).

### 5.5 Failure Modes

* **Hallucination Detected:** The response is discarded, and a fallback "I am not sure" or "I don't recall" message is returned.
* **Policy Violation:** Returns `ERR_CONTENT_POLICY`.

### 5.6 Required Telemetry

* `hallucination_check: "pass" | "fail"`
* `violation_type: "unsupported_capability" | "ungrounded_memory"`

### 5.7 DO / DO NOT

* **DO:** Use regex or keyword lists to block "I sent", "I emailed", "I called".
* **DO:** Retry *once* with a correction prompt if cost allows.
* **DO NOT:** Pass raw unvalidated claims to the user in Phase 4+.

---

## 6. Contract 5: MEMORY_WRITE_GUARDRAIL_CONTRACT

### 6.1 Purpose

To protect the integrity of the Long-Term Memory store. This contract acts as the "Write Blocker" preventing garbage, hallucinations, high-risk content, or transient noise from polluting the `SemanticGraph`.

### 6.2 Inputs

* `MemoryUpdatePayload` (Proposed Semantic Nodes / Timeline Events)
* `RiskLevel` (from Contract 3)
* `UserConfirmationStatus` (Confirmed / Inferenced)

### 6.3 Outputs

* `WriteDecision`: `COMMIT` | `DISCARD` | `QUARANTINE`
* `RedactedPayload` (Safe subset of data)

### 6.4 Invariants

1. **No Risk Storage:** If `RiskLevel` >= `HIGH`, NO raw text or sensitive semantic nodes may be written. Only generic "Safety Event" markers are allowed.
2. **No Inference Commitment:** Inferred facts (Probabilistic) MUST NOT be written as Definite Facts without `UserConfirmation`.
3. **Privacy Redaction:** PII (Phone, ID) must be scrubbed *before* reaching this contract (enforced upstream, verified here).

### 6.5 Failure Modes

* **High Risk Block:** Write rejected. Reason: `RISK_TOO_HIGH`.
* **Validation Failure:** Write rejected. Reason: `SCHEMA_INVALID`.

### 6.6 Required Telemetry

* `memory_write: "committed" | "blocked"`
* `block_reason: [reason]`

### 6.7 DO / DO NOT

* **DO:** Quarantine uncertain memories for later confirmation.
* **DO NOT:** Auto-save "I think you like X" as a fact.
* **DO NOT:** Write to memory during an active panic/emergency flow (focus is on safety, not retention).

---

## 7. Contract 6: MULTI_LLM_ROUTING_FORWARD_CONTRACT

### 7.1 Purpose

To enable the dynamic selection of the "Best Model for the Job" based on the `LLM_CAPABILITY_MANIFEST`, `COST_BUDGET`, and `RISK_CLASSIFIER`. This is the central brain of Phase 5.

### 7.2 Inputs

* `TaskType` (Reasoning, Summary, Extraction, Creative)
* `RequiredCapabilities` (JSON, Arabic, etc.)
* `RiskLevel`
* `BudgetRemaining`

### 7.3 Outputs

* `SelectedRoute`:
* `Provider` / `Model`
* `Parameters` (Temp, Tokens)


* `FallbackRoute` (Plan B)

### 7.4 Invariants

1. **Safety First:** If `RiskLevel` is `EXTREME`, the Route MUST be `NULL` (No LLM).
2. **Budget Compliance:** The selected model’s estimated cost MUST fit within `BudgetRemaining`.
3. **Capability Match:** The selected model MUST satisfy ALL `RequiredCapabilities`.

### 7.5 Failure Modes

* **No Route Available:** No model meets all criteria (Cost + Capability + Safety). Returns `ERR_NO_ROUTE`. Falls back to Rule-Based Engine.

### 7.6 Required Telemetry

* `route_selected: [model_id]`
* `routing_logic: "cost_optimized" | "capability_required" | "safety_constrained"`
* `fallback_triggered: true/false`

### 7.7 DO / DO NOT

* **DO:** Default to the cheapest model that satisfies capabilities.
* **DO:** Support "A/B Testing" routing (traffic splitting) if capabilities match.
* **DO NOT:** Hardcode "Use GPT-4". Always use "Use Model with [X] Capability".

---

## 8. Approval Checklist

| Check | Requirement | Verified? |
| --- | --- | --- |
| **Fail-Closed** | Do all contracts default to a safe/halt state on failure? | ⬜ |
| **No "Best Effort"** | Is "trying anyway" explicitly forbidden in failure modes? | ⬜ |
| **Budget Aware** | Is cost treated as a hard constraint, not a logging metric? | ⬜ |
| **Write Protection** | Is memory explicitly protected from high-risk/hallucinated writes? | ⬜ |
| **Telemetry** | Do all contracts require specific reason codes for observability? | ⬜ |
| **Abstraction** | Are specific model names (GPT/Gemini) abstracted behind Manifests? | ⬜ |

---

### Phase 5 Mandatory Clarifications (Binding)
1. Risk Level Mapping
EXTREME risk is a superset of HIGH and maps directly to Phase 4 Emergency Mode.

2. Hallucination Retry Constraint
A retry does not change model, capability scope, or risk classification.
Retry operates under stricter prompting only.

3. Memory Quarantine Ownership
Quarantined memory is system-owned, ephemeral, and never exposed to the user
until explicit user confirmation is obtained.

4. LNN State Boundary
LNN_State may only escalate risk levels.
It must never reduce risk or unlock restricted capabilities.

---

**End of Phase 5 Specification**

---

## END OF CONTRACT