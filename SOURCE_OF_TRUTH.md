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
```

node server.js

```

### 2.2 Documentation Repository
- Repo: https://github.com/Wolfy-Wooolfy/Halo-Documents
- Authoritative branch: `main`

---

## 3) Runtime Entry & Execution Flow

- Entry point: `server.js` (repo root)
- Core execution root: `src/`
- API exposed through Express routes
- Primary user interaction via `/chat` endpoint

---

## 4) CODE MAP  
### (RAW – Source of Execution)

> Any file **not listed here with a RAW link is considered non-existent**  
> for review, modification, or reasoning.

---

### 4.1 Repo Root (Halo-backend)

#### SOURCE_OF_TRUTH.md  
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/SOURCE_OF_TRUTH.md  
Role:  
Authoritative collaboration contract, access rules, and engineering protocol.

---

#### package.json  
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/package.json  
Role:  
Project identity, dependencies, scripts, and runtime constraints.

---

#### package-lock.json  
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/package-lock.json  
Role:  
Exact dependency resolution lock to guarantee deterministic builds.

---

#### server.js  
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/server.js  
Role:  
Application bootstrap, Express initialization, middleware loading, route mounting.

---

### 4.2 Client (halo-client)

#### halo-client/index.html  
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/halo-client/index.html  
Role:  
Minimal client / playground for interacting with HALO backend API.

---

### 4.3 Routes Layer

#### src/routes/chat.js  
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/routes/chat.js  
Role:  
Primary API entry point.  
Responsible for:
- Request normalization
- Language detection
- Context classification
- Safety checks
- Routing decisions
- Passing orchestration data to core logic

---

#### src/routes/chatRoutes.js  
RAW:  
(TO BE ADDED)  
Role:  
Optional route aggregation / abstraction layer (if used).  
Must not contain business logic.

---

### 4.4 Core Layer

#### src/core/app.js  
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/core/app.js  
Role:  
Core application wiring and shared initialization logic.

---

#### src/core/chatController.js  
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/core/chatController.js  
Role:  
High-level orchestration controller between routes and engines.  
No direct LLM calls.  
No policy decisions.

---

### 4.5 Engines Layer (HALO Intelligence Core)

#### reasoningEngine.js  
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/reasoningEngine.js  
Role:  
Core response generation logic.  
Coordinates prompt building, model selection, and structured output.

---

#### policyEngine.js  
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/policyEngine.js  
Role:  
Constraint enforcement engine.  
Applies behavioral limits, UX rules, safety overlays, and response shaping.

---

#### memoryEngine.js  
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/memoryEngine.js  
Role:  
User memory read/write layer.  
Maintains longitudinal context, state continuity, and recall eligibility.

---

#### promptBuilder.js  
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/promptBuilder.js  
Role:  
Transforms system rules, memory snapshots, and user input into final LLM prompts.

---

#### contextClassifier.js  
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/contextClassifier.js  
Role:  
Classifies message intent and emotional load (low stress, decision, planning, etc.).

---

#### dialectEngine.js  
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/dialectEngine.js  
Role:  
Dialect normalization and culturally-aware phrasing logic.

---

#### languageDetector.js  
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/languageDetector.js  
Role:  
Primary language and variant detection (Arabic, English, dialect hints).

---

#### llmClient.js  
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/llmClient.js  
Role:  
LLM abstraction layer.  
Handles provider selection, API calls, retries, and fallback logic.

---

#### routingEngine.js  
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/routingEngine.js  
Role:  
Decides execution route based on context, safety, memory, and policy signals.

---

#### safetyGuard.js  
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/safetyGuard.js  
Role:  
Pre-reasoning safety filter.  
Detects risk levels and enforces safety categories.

---

#### memoryExtractor.js  
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/memoryExtractor.js  
Role:  
Extracts memory-worthy signals from interactions.

---

#### memorySignalApplier.js  
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/engines/memorySignalApplier.js  
Role:  
Applies extracted memory signals into structured memory storage.

---

### 4.6 Tests

#### src/tests/chat.contract.test.js  
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-backend/main/src/tests/chat.contract.test.js  
Role:  
API contract enforcement.  
Guarantees response shape stability and backward compatibility.

---
## 5) HALO Documents Map  
### (RAW – Authoritative Concept, Rules & Governance)

All documents listed below are **authoritative references** for HALO behavior, scope, rules, UX, safety, growth, and long-term evolution.

They may not execute code directly, but:
- They DEFINE how the system must behave
- They GOVERN future code changes
- They OVERRIDE assumptions in case of ambiguity
- They are binding for design, UX, safety, and intelligence decisions

No document listed here may be ignored, skipped, or overridden.

---

### HALO – Memory System — Growth + Semantic Engine
RAW:  
(TO BE ADDED)  
Role:  
Defines memory growth philosophy, semantic expansion rules, and how user memory evolves over time.

---

### HALO – Build Progress Log (Live)
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Build%20Progress%20Log%20(Live).md  
Role:  
Chronological, immutable log of all confirmed engineering decisions, changes, and milestones.

---

### HALO – Business & Growth Strategy
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Business%20%26%20Growth%20Strategy.md  
Role:  
Defines monetization logic, growth assumptions, market positioning, and scaling strategy.

---

### HALO – Cognitive & Interaction Core (Unified Edition)
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Cognitive%20%26%20Interaction%20Core%20(Unified%20Edition).md  
Role:  
Canonical definition of HALO’s thinking model, interaction philosophy, response structure, and behavioral constraints.

---

### HALO – Core User Journeys
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Core%20User%20Journeys.md  
Role:  
Defines primary user flows, expected interactions, and lifecycle touchpoints.

---

### HALO – Day-1 Experience Toolkit
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Day-1%20Experience%20Toolkit.md  
Role:  
Defines onboarding logic, first-use behavior, and initial trust-building experience.

---

### HALO – Developer Implementation Guide (Version 0.1)
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Developer%20Implementation%20Guide%20(Version%200.1).md  
Role:  
Technical guidance for implementing HALO concepts correctly and consistently.

---

### HALO – Failover & Recovery Logic
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Failover%20%26%20Recovery%20Logic.md  
Role:  
Defines system behavior under failure, degradation, and recovery scenarios.

---

### HALO – Final UX Clarifications & Micro-Rules (Version 1.0)
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Final%20UX%20Clarifications%20%26%20Micro-Rules%20(Version%201.0).md  
Role:  
Authoritative UX micro-rules, phrasing constraints, and interaction details.

---

### HALO – Master Index (Single Source of Truth)
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Master%20Index%20(Single%20Source%20of%20Truth).md  
Role:  
Global index linking all HALO documents and defining precedence.

---

### HALO – Model Routing Specification
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Model%20Routing%20Specification.md  
Role:  
Defines model selection logic, routing decisions, and fallback behavior.

---

### HALO – Multi-Language Intelligence Rules
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Multi-Language%20Intelligence%20Rules.md  
Role:  
Defines language handling, dialect awareness, cultural sensitivity, and tone adaptation.

---

### HALO – Product Scope & Evolution Map (Unified)
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Product%20Scope%20%26%20Evolution%20Map%20(Unified).md  
Role:  
Defines current scope, future phases, and controlled evolution of HALO.

---

### HALO – Project Overview
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Project%20Overview.md  
Role:  
High-level description of HALO vision, purpose, and system identity.

---

### HALO – Prompt Architecture
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Prompt%20Architecture.md  
Role:  
Defines prompt composition rules, structure, and constraints.

---

### HALO – Retention Architecture
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Retention%20Architecture.md  
Role:  
Defines retention mechanics, long-term engagement logic, and memory-driven stickiness.

---

### HALO – Safety Framework
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Safety%20Framework.md  
Role:  
Canonical safety rules, escalation logic, and risk boundaries.

---

### HALO – System Architecture & Intelligence Map
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20System%20Architecture%20%26%20Intelligence%20Map.md  
Role:  
End-to-end system topology and intelligence flow map.

---

### HALO – Target User Profile
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20Target%20User%20Profile.md  
Role:  
Defines the intended user, their needs, constraints, and expectations.

---

### HALO – UX FLOW
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20UX%20FLOW.md  
Role:  
Defines detailed UX flow, screens, and interaction transitions.

---

### HALO – User Personas Profiles
RAW:  
https://raw.githubusercontent.com/Wolfy-Wooolfy/Halo-Documents/main/HALO%20%E2%80%93%20User%20Personas%20Profiles.md  
Role:  
Defines user archetypes and behavioral patterns for design and reasoning alignment.

---

## 6) Working Protocol (Strict)

1) Khaled specifies the **exact file path**.
2) Assistant must read the **RAW authoritative version**.
3) Assistant confirms explicitly: *“File read from GitHub (main)”*.
4) Any change must be:
 - Incremental
 - Justified
 - Based on existing content
5) Assistant returns the **FULL file content after modification**.
6) Khaled commits and logs the change.

---

## 7) Zero-Tolerance Rules

- No assumption-based edits
- No hallucinated files
- No rebuilding files from memory
- GitHub always wins

---

## END OF CONTRACT
```