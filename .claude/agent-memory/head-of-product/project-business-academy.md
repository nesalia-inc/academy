---
name: project-business-academy
description: Coding education platform - challenges, categories, LeetCode-style editor
type: project
---

## Business Context

**Project:** Coding Education Platform (like LeetCode)
**Stage:** Day 0 — cloned template, requirements defined
**Primary Platform:** Web (end users/learners)
**Secondary Platform:** CLI (for AI agents to create content)

---

## Core Domain Model

### Entities

```
User
├── level (gamification)
├── xp / points
├── streak (daily challenges)
└── submissions

Category
├── name
├── slug
├── icon
└── challenges[]

Challenge
├── title, slug
├── description (markdown)
├── starterCode (file system)
├── solution (hidden)
├── difficulty (easy/medium/hard)
├── testCases
├── timeLimit
├── memoryLimit
└── submissions[]

Submission
├── userId
├── challengeId
├── code
├── language
├── status (pending/passed/failed)
├── executionTime
├── memoryUsed
├── testResults
└── createdAt

DailyChallenge
├── date
├── challengeId
├── bonusXp
└── completedBy[]
```

---

## Key Features

1. **Challenge Browser** - Categories + search + filters
2. **Challenge Player** - LeetCode-style two-panel editor
3. **Monaco Editor** - File system, tabs, terminal
4. **Code Execution** - Sandbox for running code
5. **Submissions** - History + status + results
6. **Daily Challenges** - Calendar gamification
7. **User Profile** - Level, XP, progress, badges
8. **Gamification** - Levels, streaks, leaderboard (later)

---

## Technical Challenges

1. **Code Execution** - Need sandbox (Docker? serverless functions?)
2. **Monaco + File System** - Complex UI state management
3. **Terminal Emulator** - xterm.js integration
4. **Real-time** - WebSocket for execution results
5. **Languages** - Which languages to support?

---

## Layout Pattern

**Home/Challegnes Page:**
```
┌─────────────────────────────────────────────────────────┐
│ [Nav]                                                   │
├──────────────────────────┬──────────────────────────────┤
│ Challenge du Jour (card) │ User Profile Card            │
│                          │ - Avatar, Name, Level        │
│ Categories (cards)       │ - XP bar                     │
│                          │ - Streak 🔥                  │
│ All Challenges (table)    │                              │
│                          │ Daily Challenge Calendar     │
│                          │ - Month view                 │
│                          │ - Completed days highlighted │
└──────────────────────────┴──────────────────────────────┘
```

**Challenge Page:**
```
┌─────────────────────────────────────────────────────────┐
│ [Nav]                                                   │
├──────────────────────────┬──────────────────────────────┤
│ Tabs:                    │ Monaco Editor                │
│ [Description|Solution|   │ ┌──────────────────────────┐ │
│  Submissions]            │ │ File Explorer │ Tabs     │ │
│                          │ ├──────────────────────────┤ │
│                          │ │                          │ │
│                          │ │   Code Area              │ │
│                          │ │                          │ │
│                          │ ├──────────────────────────┤ │
│                          │ │ Terminal Output          │ │
│                          │ └──────────────────────────┘ │
│                          │ [Run] [Submit] [Reset]      │
└──────────────────────────┴──────────────────────────────┘
```

## Technical Decisions

### Code Execution: secure-exec (V8 Isolates)

**Why:** Lightweight, no Docker required, fast cold start (17ms vs 3s)

| Metric | Secure Exec | Docker Sandbox |
|--------|-------------|----------------|
| Cold start | **17ms** | 3,150ms |
| Memory/execution | **~3.4 MB** | ~256 MB |
| Cost/execution | **$0.000011/s** | $0.000625/s |

**Constraints:**
- Runs on Node.js, Bun, or HTML5 browser
- Does NOT work on Cloudflare Workers (no V8 API access)
- Supported: Node.js, Python

### Languages Supported

- JavaScript (primary)
- TypeScript (transpile to JS then execute)
- Python (secure-exec supports it)

- Evaluate features by "does this serve learners or content creators?"
- CLI features = agent productivity for creating challenges/content
- Web features = user experience, engagement, completion
- Code execution is the hardest technical problem — needs architecture decision