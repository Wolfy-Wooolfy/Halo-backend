# SOURCE_OF_TRUTH — HALO (Authoritative Access Map)

## 1) Source of Truth (Single Authority)
GitHub repositories are the ONLY source of truth for code + docs.
Anything outside GitHub (attachments, exported docs, screenshots, chat history) is non-authoritative unless explicitly pasted as text and approved.

## 2) Repositories
### Code Repository (Backend)
Repo: https://github.com/Wolfy-Wooolfy/Halo-backend  
Authoritative branch: main

### Documents Repository
Repo: https://github.com/Wolfy-Wooolfy/Halo-Documents  
Authoritative branch: main

## 3) Project Runtime & Entry
Runtime: Node.js  
Start command:
node server.js

Entry file:
server.js (repo root)

## 4) Backend Code Layout (High-Level)
Authoritative code root:
src/

Key folders:
- src/core
- src/engines
- src/routes
- src/tests

Other repo-level folder:
- halo-client (present at repo root)

## 5) Non-Negotiable Engineering Rules
### 5.1 Read-Before-Edit Rule
No file may be modified unless its CURRENT authoritative version from GitHub main branch has been read in full first.

### 5.2 No Rewrites / No “From Memory”
Never re-create or rewrite a file “from scratch” based on assumptions.
All changes must be incremental patches based on the exact existing content.

### 5.3 Full-File Return Rule
Whenever code is changed, the assistant must return the FULL file content after the change (not diffs, not partial snippets).

### 5.4 Authoritative Text Format
All authoritative docs must be plain text formats (Markdown .md preferred).
Binary formats are not authoritative for collaboration.

### 5.5 Conflict Resolution
If there is a conflict between:
- Chat text vs GitHub: GitHub wins.
- Local copies vs GitHub: GitHub main wins unless explicitly stated otherwise.
- Old links vs latest repo content: latest main branch content wins.

## 6) Working Protocol (How We Collaborate)
1) Khaled specifies the target file path (example: src/engines/policyEngine.js).
2) Assistant must read the authoritative version from GitHub (main branch).
3) Assistant proposes the change.
4) Assistant returns the FULL updated file content.
5) Khaled applies the change and commits to GitHub.

## 7) Security / Integrity Notes
- No assumption-based code changes.
- No “invisible progress” — anything changed must be reflected in GitHub commits and logged in the Build Progress Log.
