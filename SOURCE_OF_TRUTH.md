# SOURCE_OF_TRUTH — HALO

**Authoritative Access Map & Engineering Contract**

---

## 1) Source of Truth (Single Authority)

GitHub repositories are the **ONLY authoritative source** for HALO code and documentation.

Anything outside GitHub (attachments, ZIP files, exported docs, screenshots, or chat history) is **non-authoritative** unless:

* explicitly pasted as plain text, and
* explicitly approved as authoritative.

No assumptions. No inferred state.

---

## 2) Repositories

### Backend Code Repository

* Repo: [https://github.com/Wolfy-Wooolfy/Halo-backend](https://github.com/Wolfy-Wooolfy/Halo-backend)
* Authoritative branch: `main`

### Documents Repository

* Repo: [https://github.com/Wolfy-Wooolfy/Halo-Documents](https://github.com/Wolfy-Wooolfy/Halo-Documents)
* Authoritative branch: `main`

---

## 3) Runtime & Entry Point

* Runtime: **Node.js**
* Start command:

```bash
node server.js
```

### Primary Entry File

* `server.js` (repository root)

This file is the **single runtime bootstrap** for HALO backend.

---

## 4) CODE MAP (RAW – SOURCE OF EXECUTION)

This section defines the **authoritative execution map**.
Any file **not listed here with a RAW link is considered non-existent** for collaboration purposes.

---

### Halo-backend (Repository Root)

* **SOURCE_OF_TRUTH.md**
  RAW: [https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/SOURCE_OF_TRUTH.md](https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/SOURCE_OF_TRUTH.md)
  Role:
  *Authoritative collaboration contract defining access rules, workflow protocol, and conflict resolution.*

* **package.json**
  RAW: [https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/package.json](https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/package.json)
  Role:
  *Project metadata, scripts, dependencies, and runtime configuration.*

* **package-lock.json**
  RAW: [https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/package-lock.json](https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/package-lock.json)
  Role:
  *Exact dependency resolution and version locking.*

* **server.js**
  RAW: [https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/server.js](https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/server.js)
  Role:
  *Application bootstrap, Express initialization, middleware wiring, route mounting, and server start.*

---

### halo-client

* **halo-client/index.html**
  RAW: [https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/halo-client/index.html](https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/halo-client/index.html)
  Role:
  *Minimal client interface for manual testing and interaction with HALO backend.*

---

### routes

* **src/routes/chat.js**
  RAW: [https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/routes/chat.js](https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/routes/chat.js)
  Role:
  *Primary API entry point for user interaction.
  Responsible for request normalization, language detection, safety checks, routing, orchestration, and response assembly.*

* **src/routes/chatRoutes.js**
  RAW: *(to be added)*
  Role:
  *Route grouping / abstraction layer for chat-related endpoints (if used).*

---

### core

* **src/core/app.js**
  RAW: [https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/core/app.js](https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/core/app.js)
  Role:
  *Core application wiring logic. Acts as an internal orchestration layer separate from Express routing.*

* **src/core/chatController.js**
  RAW: [https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/core/chatController.js](https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/core/chatController.js)
  Role:
  *High-level chat flow controller coordinating engines without HTTP concerns.*

---

### engines

* **src/engines/reasoningEngine.js**
  RAW: [https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/reasoningEngine.js](https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/reasoningEngine.js)
  Role:
  *Core cognitive engine. Generates HALO responses using policy, memory, context, and LLM output.*

* **src/engines/policyEngine.js**
  RAW: [https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/policyEngine.js](https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/policyEngine.js)
  Role:
  *Applies behavioral constraints, response shaping rules, and safety-aligned policies.*

* **src/engines/memoryEngine.js**
  RAW: [https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/memoryEngine.js](https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/memoryEngine.js)
  Role:
  *Persistent user memory management: read, write, snapshot, and delta calculation.*

* **src/engines/promptBuilder.js**
  RAW: [https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/promptBuilder.js](https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/promptBuilder.js)
  Role:
  *Constructs system + user prompts based on language, context, policy, and memory.*

* **src/engines/contextClassifier.js**
  RAW: [https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/contextClassifier.js](https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/contextClassifier.js)
  Role:
  *Classifies message intent and emotional context (low stress, decision, planning, etc.).*

* **src/engines/dialectEngine.js**
  RAW: [https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/dialectEngine.js](https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/dialectEngine.js)
  Role:
  *Dialect and tone adaptation layer (Arabic variants, informal/formal adjustments).*

* **src/engines/languageDetector.js**
  RAW: [https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/languageDetector.js](https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/languageDetector.js)
  Role:
  *Detects message language and confidence level.*

* **src/engines/llmClient.js**
  RAW: [https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/llmClient.js](https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/llmClient.js)
  Role:
  *LLM abstraction layer (OpenAI / future providers). Handles API calls and response parsing.*

* **src/engines/memoryExtractor.js**
  RAW: [https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/memoryExtractor.js](https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/memoryExtractor.js)
  Role:
  *Extracts memory-relevant signals from user messages.*

* **src/engines/memorySignalApplier.js**
  RAW: [https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/memorySignalApplier.js](https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/memorySignalApplier.js)
  Role:
  *Applies extracted signals to stored memory structures.*

* **src/engines/messageNormalizer.js**
  RAW: [https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/messageNormalizer.js](https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/messageNormalizer.js)
  Role:
  *Normalizes raw user input (cleanup, standardization, preprocessing).*

* **src/engines/routingEngine.js**
  RAW: [https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/routingEngine.js](https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/routingEngine.js)
  Role:
  *Decides execution route and attaches policy decisions based on context, safety, and memory.*

* **src/engines/safetyGuard.js**
  RAW: [https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/safetyGuard.js](https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/engines/safetyGuard.js)
  Role:
  *Safety and risk detection layer. Flags high-risk or sensitive content.*

---

### tests

* **src/tests/chat.contract.test.js**
  RAW: [https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/tests/chat.contract.test.js](https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/refs/heads/main/src/tests/chat.contract.test.js)
  Role:
  *Contract-level tests validating API response structure and invariants.*

---

## 5) Non-Negotiable Engineering Rules

### 5.1 Read-Before-Edit Rule

No file may be modified unless its **current authoritative version** from GitHub `main` has been read **in full**.

### 5.2 No Rewrites / No Assumptions

No file may be recreated, approximated, or rewritten from memory or architectural assumptions.

### 5.3 Full-File Return Rule

Any code change must be returned as the **full updated file content** — no diffs, no partial snippets.

### 5.4 Authoritative Format

Only plain text formats (`.md`, `.js`, `.json`) are authoritative for collaboration.

### 5.5 Conflict Resolution

* Chat vs GitHub → GitHub wins
* Local copy vs GitHub → GitHub `main` wins
* Old links vs current repo → latest `main` wins

---

## 6) Working Protocol

1. Khaled specifies the **target file path**.
2. Assistant reads the **RAW authoritative version**.
3. Assistant confirms reading it explicitly.
4. Assistant proposes changes.
5. Assistant returns **full updated file**.
6. Khaled commits to GitHub.

---

## 7) Security & Integrity

* No assumption-based edits.
* No invisible progress.
* All changes must exist as GitHub commits and be traceable.

---