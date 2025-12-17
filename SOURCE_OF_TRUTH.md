# SOURCE_OF_TRUTH — HALO  
## Authoritative Access Map & Engineering Contract

---

## 1) Single Source of Truth (Non-Negotiable)

GitHub repositories are the **ONLY authoritative source** for:

- Executable code
- Architecture decisions
- System rules
- Product logic
- Behavioral contracts
- Safety boundaries
- Memory philosophy

No interpretation, inference, or assumption is allowed outside what is explicitly defined here or in linked RAW documents.

---

## 2) Authoritative Branch

- **Branch:** `main`
- All RAW links MUST point to the `main` branch.
- Multiple RAW URL formats are accepted as authoritative if already present.
- **No existing RAW link may be removed or replaced.**

---

## 3) Working Protocol (Hard Rules)

1. Khaled specifies the **exact file path** for any modification.
2. The assistant has **full read authority** on all RAW links listed below without requesting permission.
3. **Before proposing or providing ANY code change**, the assistant MUST:
   - Read the complete current authoritative version.
   - Read all directly related or dependent files.
   - Explicitly state:  
     **READ COMPLETE: `<file paths>`**
4. If the confirmation above is missing, the assistant MUST STOP.
5. Partial edits, inferred edits, or speculative edits are strictly forbidden.

---

## 4) Authority & Scope Rules

- Any file **listed below with a RAW link is authoritative**.
- Any file **not yet listed is considered non-authoritative until mapped**.
- No authoritative file may be overridden, summarized, or contradicted.
- New files may only gain authority by being explicitly added to this document.

---

## 5) HALO Backend — Authoritative Code Map

### Entry & Runtime
- `server.js`  
  RAW:  
  https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/server.js

- `package.json`  
  RAW:  
  https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/package.json

---

### Routes
- `src/routes/chat.js`  
  RAW:  
  https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/routes/chat.js

---

### Core / Controllers
- `src/core/chatController.js`  
  RAW:  
  https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/core/chatController.js

---

### Engines

- `src/engines/policyEngine.js`  
  RAW:  
  https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/policyEngine.js

- `src/engines/reasoningEngine.js`  
  RAW:  
  https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/reasoningEngine.js

- `src/engines/memoryEngine.js`  
  RAW:  
  https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/memoryEngine.js

- `src/engines/languageDetector.js`  
  RAW:  
  https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/languageDetector.js

- `src/engines/promptBuilder.js`  
  RAW:  
  https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/promptBuilder.js

---

### LLM Client
- `src/clients/llmClient.js`  
  RAW:  
  https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/clients/llmClient.js

---

### Safety & Guards
- `src/safety/safetyGuard.js`  
  RAW:  
  https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/safety/safetyGuard.js

---

### Tests (All tests are authoritative)

- `tests/safety.emergency.test.js`  
  RAW:  
  https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/tests/safety.emergency.test.js

- `tests/policy.test.js`  
  RAW:  
  https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/tests/policy.test.js

- `tests/language.test.js`  
  RAW:  
  https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/tests/language.test.js

---

## 6) HALO Documents — Authoritative Knowledge & Philosophy

All documents below define **how HALO thinks, remembers, reasons, and protects users**.  
They are equal in authority to backend code.

---

### HALO – Project Overview
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20-%20Project%20Overview.md

---

### HALO – Cognitive & Interaction Core
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20-%20Cognitive%20%26%20Interaction%20Core.md

---

### HALO – Safety & Psychological Boundaries
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20-%20Safety%20%26%20Psychological%20Boundaries.md

---

### HALO – Memory System — Growth + Semantic Engine
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/refs/heads/main/HALO%20-%20Memory%20System%20%E2%80%94%20Growth%20%2B%20Semantic%20Engine.md

This document is **fully authoritative** and defines:

- What HALO may remember
- What HALO must NEVER store
- Semantic-only memory rules
- Growth stages of memory
- Emotional and behavioral pattern encoding
- Long-term cognitive safety constraints

---

## 7) Architectural Non-Negotiables

- Engines MUST NOT:
  - Call other engines directly
  - Access HTTP, Express, or environment variables
  - Generate final user-facing responses

- Routes MUST NOT:
  - Contain reasoning, policy, or memory logic

- Controllers MUST:
  - Orchestrate engines
  - Respect document-defined boundaries

- Memory MUST:
  - Follow **HALO – Memory System — Growth + Semantic Engine**
  - Store meaning, never identity

---

## 8) Final Enforcement Clause

If any future answer, suggestion, or code change:

- Ignores this document
- Removes an existing RAW link
- Contradicts an authoritative document
- Introduces assumptions not explicitly defined

It is considered **invalid and rejected by contract**.

---
