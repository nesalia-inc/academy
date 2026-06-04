# Academy — Product Specification

**Last updated:** 2026-06-03
**Status:** Requirements defined, implementation not started

---

## Scope Decisions

### IN Scope
- Software engineering challenges (algorithms, data structures, system design)
- Daily practice
- Gamification (levels, XP)
- Web platform (primary)
- CLI for AI agents to create content

### OUT of Scope (for now)
- Monetization (free for all initially)
- Social features (discussions, shared solutions, leaderboard)
- Mobile app
- Video content
- B2B/enterprise features

### Content Strategy
- Start with zero challenges
- Content created via CLI (AI agents)
- Focus on quality over quantity

---

## Overview

Academy is a coding education platform (similar to LeetCode) where users solve programming challenges to learn and improve their skills.

### Core Features

1. **Challenge Browser** — Browse and filter challenges by category, difficulty
2. **Challenge Player** — LeetCode-style split-pane editor with Monaco
3. **Code Execution** — Run code in sandboxed environment (secure-exec)
4. **Exercises & Submissions** — Track progress and results
5. **Gamification** — Levels, XP

### Target Users

| Persona | Use Case |
|---------|----------|
| **Learners** | Solve challenges to improve coding skills |
| **Content Creators (AI Agents)** | Create challenges via CLI |

---

## Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4, shadcn/ui |
| **Editor** | Monaco Editor (VS Code) |
| **API** | tRPC v11, Zod v4 |
| **Database** | PostgreSQL, Drizzle ORM |
| **Auth** | Better Auth |
| **Code Execution** | secure-exec (V8 isolates) |
| **State** | TanStack Query |

### Monorepo Structure

```
apps/
├── web/           # Next.js frontend (end users)
└── cli/           # CLI tools (AI agents create content)

packages/
├── db/            # Drizzle ORM schema
├── api/           # tRPC server
├── auth/          # Better Auth configuration
└── sdk/           # API client
```

---

## Domain Model

See [domain-model.md](./domain-model.md) for complete entity definitions.

### Entities Overview

| Entity | Purpose |
|--------|---------|
| `user` (Better Auth) | Auth identity (email, OAuth, sessions) |
| `UserProfile` | Gamification data (level, XP) |
| `Category` | Challenge categories (Arrays, Trees, etc.) |
| `Challenge` | Challenge definition (title, description, solution) |
| `Exercise` | User's interaction with a challenge (code, progress) |
| `Submission` | Final result after submitting an exercise |

### Challenge Rules

- **XP Reward:** Dynamic based on difficulty
  - Easy: 100 XP
  - Medium: 200 XP
  - Hard: 300 XP

- **Daily Challenge:** The most recently published challenge
  - No `isDaily` flag
  - Query: `ORDER BY createdAt DESC LIMIT 1`

The separation of `Challenge` (definition) and `Exercise` (user interaction) allows for multiple exercise types:

| Type | Status | Description |
|------|--------|-------------|
| `coding` | ✅ Initial | Code challenges with test cases (JS, TS, Python) |
| `mcq` | 🔜 Future | Multiple choice questions |
| `fill-blank` | 🔜 Future | Fill in the blanks |

---

## Code Execution

### Technology

**secure-exec** — Lightweight sandboxed execution using V8 isolates.

| Metric | secure-exec | Docker Sandboxes |
|--------|-------------|------------------|
| Cold start | 17ms | 3,150ms |
| Memory/execution | ~3.4 MB | ~256 MB |

### Supported Languages

| Language | Execution |
|----------|-----------|
| JavaScript | Direct execution via V8 |
| TypeScript | Transpile to JS, then execute |
| Python | secure-exec Python runner |

### Resource Limits

- CPU time: 5 seconds max
- Memory: 64 MB max

---

## User Interface

### Pages

```
/                           # Home / redirects to /challenges
/login                      # Sign in
/signup                     # Create account
/challenges                 # Challenge browser
  /challenges/categories    # Category list
    /challenges/categories/[slug]  # Challenges in category
  /challenges/[slug]        # Challenge player
    /challenges/[slug]/description  # Tab: description
    /challenges/[slug]/solution      # Tab: solution (after success)
    /challenges/[slug]/submissions   # Tab: submission history
      /challenges/[slug]/submissions/[id]  # Single submission detail
```

### Challenge Browser Layout

```
┌────────────────────────────────────────────────────────────────┐
│ [Nav]                                                          │
├────────────────────────────────┬───────────────────────────────┤
│                                │                               │
│  Challenge du Jour (card)      │  User Profile Card             │
│  - Featured daily challenge     │  - Avatar, Name, Level        │
│  - XP indicator                 │  - XP Progress Bar            │
│                                │                               │
│  Categories (cards grid)        │  Daily Challenge Calendar     │
│  - Icon, Name, Challenge count  │  - Month view                 │
│                                │  - Completed days highlighted │
│  All Challenges (table)         │  - Today indicator            │
│  - Title, Difficulty, Category  │                              │
│  - Solve count                  │                              │
│                                │                              │
└────────────────────────────────┴───────────────────────────────┘
```

### Challenge Player Layout

```
┌────────────────────────────────────────────────────────────────┐
│ [Nav] — Challenge Title — Difficulty Badge — Language Selector  │
├────────────────────────────────┬───────────────────────────────┤
│                                │                               │
│  Tabs:                         │  File Explorer                 │
│  [Description|Solution|         │  ├── solution.js              │
│   Submissions]                 │  ├── tests.js                  │
│                                │  └── user_solution.js  ← active│
│  Content Area:                 ├───────────────────────────────┤
│  (based on selected tab)       │  Monaco Editor                │
│                                │  ┌────────────────────────────┐│
│  Description:                  │  │                            ││
│  - Markdown rendered           │  │  Code here                 ││
│  - Examples (input/output)     │  │                            ││
│  - Constraints                 │  │                            ││
│  - Hints (optional)            │  ├────────────────────────────┤│
│                                │  │ Terminal Output            ││
│  Solution (after success):     │  │ $ ...                       ││
│  - Reference solution          │  └────────────────────────────┘│
│                                │                               │
│  Submissions:                  │  [Run] [Submit] [Reset]       │
│  - Table with status, time     │                               │
│                                │                               │
└────────────────────────────────┴───────────────────────────────┘
```

---

## CLI (AI Agents)

AI agents use the CLI to create challenges programmatically.

### Commands

```bash
# Authentication
cli auth login          # Device flow login
cli auth status         # Check auth status
cli auth logout         # Clear credentials

# Challenge Management
cli challenge create     # Create a new challenge (interactive)
cli challenge import     # Import from JSON/CSV
cli challenge export    # Export challenges to JSON
cli challenge validate  # Validate challenge definition
```

### Challenge Definition Format (JSON)

```json
{
  "title": "Two Sum",
  "slug": "two-sum",
  "category": "arrays",
  "difficulty": "easy",
  "type": "coding",
  "description": "Given an array of integers...",
  "starterCode": {
    "solution.js": "function twoSum(nums, target) {\n  // Your code here\n}"
  },
  "testCases": [
    { "input": [[2, 7, 11, 15], 9], "output": [0, 1] }
  ],
  "languages": ["js", "ts", "python"]
}
```

**Note:** XP reward is calculated dynamically based on difficulty (100/200/300 XP).

---

## Roadmap

### Phase 1 — Foundation
- [ ] Domain model (DB schema for categories, challenges, exercises, submissions)
- [ ] Auth + user profile (level, XP)
- [ ] Categories + challenge list page
- [ ] Monaco editor integration

### Phase 2 — Core Loop
- [ ] Challenge player (description + editor)
- [ ] Code execution via secure-exec
- [ ] Test case validation
- [ ] Exercise + submission flow

### Phase 3 — Gamification
- [ ] Level-up system
- [ ] Daily challenge calendar

### Phase 4 — Content Tools
- [ ] CLI challenge creation
- [ ] Bulk import/export
- [ ] Challenge validation

---

## Open Questions

1. **Hints system** — Unlock with XP penalty?
2. **Solution reveal** — Only after passing, or via XP purchase?

---

## References

- [secure-exec](https://github.com/) — Code execution library
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) — VS Code editor component
- [LeetCode](https://leetcode.com/) — Reference product