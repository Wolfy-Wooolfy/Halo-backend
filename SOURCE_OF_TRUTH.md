# SOURCE_OF_TRUTH — HALO  
## Authoritative Access Map & Engineering Contract

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
    node server.js


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

#### server.js  
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/server.js  

---

### 4.2 Client (halo-client)

#### halo-client/index.html  
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/halo-client/index.html  

---

### 4.3 Routes Layer

#### src/routes/chat.js  
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/routes/chat.js  

---

### 4.4 Core Layer

#### src/core/app.js  
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/core/app.js  

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

#### dialectEngine.js  
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/dialectEngine.js  

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

#### memoryExtractor.js  
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/memoryExtractor.js  

---

#### memorySignalApplier.js  
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/memorySignalApplier.js  

---

### messageNormalizer.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/messageNormalizer.js

---

### 4.6 Tests

#### src/tests/chat.contract.test.js  
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/tests/chat.contract.test.js  

---

### src/tests/safety.emergency.test.js
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/tests/safety.emergency.test.js

---

## 5) HALO Documents Map  
### (RAW – Authoritative Concept, Rules & Governance)

All documents listed below are authoritative.  
To prevent conflicts, precedence must follow the **Master Index** order.

### 5.1 Master Index (Precedence Authority)
#### HALO – Master Index (Single Source of Truth)
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Master%20Index%20(Single%20Source%20of%20Truth).md  

---

### 5.2 Documents

#### HALO – Memory System — Growth + Semantic Engine
RAW: https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/refs/heads/main/HALO%20-%20Memory%20System%20%E2%80%94%20Growth%20%2B%20Semantic%20Engine.md

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

## 6) Working Protocol (Strict)

1) Khaled specifies the exact file path.
2) Assistant must read the RAW authoritative version.
3) Assistant confirms explicitly: “File read from GitHub (main)”.
4) Any change must be incremental, justified, and based on exact existing content.
5) Assistant returns the FULL file content after modification.
6) Khaled commits and logs the change.
7) Mandatory Progress Log Update: Every code change or merged fix MUST be logged in HALO – Build Progress Log (Live).md in the Halo-Documents repo before the work is considered “done”.
8) The assistant must explicitly confirm in chat: “LOG UPDATED: HALO – Build Progress Log (Live).md” after providing the new entry text.

---

## 7) Zero-Tolerance Rules

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

## 8) Absolute Read Authority (No Permission Needed)
HALO assistant has unconditional permission to READ any file referenced in this SOURCE_OF_TRUTH map (code or docs) from the authoritative GitHub main branch, at any time, without asking for approval.

---

## 9) Read-Before-Change Enforcement (Hard Gate)
Before proposing or providing ANY code modification:
1) The assistant MUST read the CURRENT authoritative version (GitHub main) of:
   - the target file to be modified, AND
   - any directly-related files that the change depends on (imports / exports / contract / callers).
2) The assistant MUST explicitly confirm: "READ COMPLETE: <file paths>".
3) If the assistant did not read, it must STOP and request the raw link(s) from the CODE MAP.

---

## END OF CONTRACT