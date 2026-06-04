# Academy — Domain Model

**Last updated:** 2026-06-03

---

## Two-User Pattern

This project uses a two-user pattern from Better Auth:

| Table | PK | Purpose | Managed by |
|-------|-----|---------|-------------|
| `user` | text (UUID) | Auth identity — email, sessions, OAuth | Better Auth |
| `users` | integer | Application data — gamification, roles | Academy app |

The `UserProfile` (app `users` table) links to Better Auth `user` via email.

---

## Entity Overview

```
User (Better Auth) ──────────► UserProfile (gamification)
                                    │
                                    ▼
                              Exercise (user × challenge)
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
                Category        Challenge        Submission
                    │               │
                    └───────────────┘
                        (category → challenge)
```

---

## Entity: User (Better Auth — auth layer)

Better Auth manages this table automatically.

```
user
├── id (text, UUID)
├── email
├── emailVerified
├── name
├── image
└── createdAt
```

---

## Entity: UserProfile (Academy — app layer)

Application-level user data including gamification.

```
userProfile
├── id (integer, auto-increment)  -- PK
├── userId (text, UUID)           -- FK to user.id, linked via email
├── level (integer, default: 1)
├── xp (integer, default: 0)
├── lastActivityAt (timestamp, nullable)
├── avatarUrl (text, nullable)
├── createdAt (timestamp)
└── updatedAt (timestamp)
```

**Indexes:**
- `userId` (unique)
- `xp` (for leaderboard queries)

---

## Entity: Category

Challenge categories (e.g., Arrays, Trees, Dynamic Programming).

```
category
├── id (integer, auto-increment)  -- PK
├── name (varchar(100), not null)
├── slug (varchar(100), unique, not null)
├── icon (varchar(50), nullable)   -- emoji or icon name
├── description (text, nullable)
├── createdAt (timestamp)
├── updatedAt (timestamp)
└── deletedAt (timestamp, nullable) -- soft-delete
```

**Indexes:**
- `slug` (unique)

---

## Entity: Challenge (Definition)

The challenge definition. One challenge can have many exercises (one per user attempt).

```
challenge
├── id (integer, auto-increment)  -- PK
├── categoryId (integer)          -- FK to category.id
├── type (varchar(50))            -- coding | mcq | fill-blank | ...
├── title (varchar(255), not null)
├── slug (varchar(255), unique, not null)
├── description (text)            -- markdown
├── difficulty (varchar(20))      -- easy | medium | hard (enum)
├── solution (text, nullable)     -- hidden until solved
├── acceptanceRate (float, default: 0)
├── totalAttempts (integer, default: 0)
├── createdAt (timestamp)
├── updatedAt (timestamp)
└── deletedAt (timestamp, nullable) -- soft-delete

-- XP Reward: Dynamic based on difficulty
--   easy: 100 XP
--   medium: 200 XP
--   hard: 300 XP

-- Daily Challenge: The most recently published challenge
--   Query: ORDER BY createdAt DESC LIMIT 1 WHERE deletedAt IS NULL

-- Coding-specific fields (nullable, only for type='coding'):
├── starterCode (jsonb, nullable)  -- { "solution.js": "...", "tests.js": "..." }
├── testCases (jsonb, nullable)    -- [{ "input": [...], "output": [...] }]
├── testTimeout (integer, nullable)
├── timeLimit (integer, nullable)   -- ms
├── memoryLimit (integer, nullable) -- MB
└── languages (jsonb, nullable)     -- ["js", "ts", "python"]
```

**Indexes:**
- `slug` (unique)
- `categoryId`
- `difficulty`
- `createdAt` (for daily challenge query)

---

## Entity: Exercise (User Interaction)

An exercise represents a user's interaction with a challenge. Created when user starts a challenge.

```
exercise
├── id (integer, auto-increment)  -- PK
├── userId (integer)              -- FK to userProfile.id
├── challengeId (integer)          -- FK to challenge.id
├── status (varchar(50))           -- in-progress | submitted | passed | failed
├── code (text, nullable)          -- user's current code
├── language (varchar(20), nullable) -- js | ts | python
├── testCases (jsonb, nullable)    -- copied from challenge at creation
├── testResults (jsonb, nullable) -- per test case results
├── executionTime (integer, nullable) -- ms
├── memoryUsed (float, nullable)   -- MB
├── errorMessage (text, nullable)
├── submittedAt (timestamp, nullable)
├── createdAt (timestamp)
├── updatedAt (timestamp)
└── deletedAt (timestamp, nullable) -- soft-delete
```

**Indexes:**
- `(userId, challengeId)` (unique — one exercise per user per challenge)
- `userId`
- `challengeId`
- `status`

---

## Entity: Submission (Final Result)

A submission is a final attempt. Created when user clicks "Submit" (vs "Run").

```
submission
├── id (integer, auto-increment)  -- PK
├── exerciseId (integer)          -- FK to exercise.id
├── status (varchar(50))           -- passed | failed | error | timeout
├── testResults (jsonb, nullable) -- per test case results
├── executionTime (integer, nullable) -- ms
├── memoryUsed (float, nullable)   -- MB
├── errorMessage (text, nullable)
├── createdAt (timestamp)
└── deletedAt (timestamp, nullable) -- soft-delete
```

**Indexes:**
- `exerciseId`
- `createdAt` (for history queries)

---

## Exercise Types

### Type: `coding` (initial)

```json
{
  "type": "coding",
  "starterCode": {
    "solution.js": "function solve() {\n  // your code\n}",
    "tests.js": "module.exports = [{ input: 1, output: 2 }]"
  },
  "testCases": [
    { "input": [2, 7, 11, 15], "output": [0, 1] }
  ],
  "testTimeout": 5000,
  "timeLimit": 5000,
  "memoryLimit": 64,
  "languages": ["js", "ts", "python"]
}
```

### Type: `mcq` (future)

```json
{
  "type": "mcq",
  "question": "Which sorting algorithm has O(n log n) average case?",
  "options": ["Bubble Sort", "Quick Sort", "Linear Search", "Insertion Sort"],
  "correctOption": 1,
  "shuffleOptions": true,
  "explanation": "Quick Sort has O(n log n) average case complexity."
}
```

### Type: `fill-blank` (future)

```json
{
  "type": "fill-blank",
  "template": "The time complexity of binary search is O(__).",
  "blanks": [
    { "position": 35, "acceptableAnswers": ["log n", "log(n)", "logn", "log₂n"] }
  ],
  "caseSensitive": false
}
```

---

## Relationships Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Better Auth                             │
├─────────────────────────────────────────────────────────────────┤
│  user                                                          │
│  └── id (UUID)                                                 │
│      ├── email                                                 │
│      └── name                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                     (linked via email)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Academy App                                │
├─────────────────────────────────────────────────────────────────┤
│  userProfile ─────────┐                                         │
│  ├── id (int)         │                                         │
│  ├── userId (FK)      │                                         │
│  ├── level, xp        │                                         │
│  └── streak           │                                         │
│                       │                                         │
│  category             │
│  ├── id (int)         │
│  └── name, slug       │
│         │             │
│         ▼             │
│  challenge            │                                         │
│  ├── id (int)         │                                         │
│  ├── categoryId (FK)   │                                         │
│  ├── type             │                                         │
│  └── ...              │                                         │
│         │             │                                         │
│         ▼             ▼                                         │
│  exercise ─────────────────────► (userId + challengeId)         │
│  ├── id (int)         │                                         │
│  ├── userId (FK)      │                                         │
│  ├── challengeId (FK) │                                         │
│  ├── code, status     │                                         │
│  └── testResults      │                                         │
│         │             │                                         │
│         ▼             │                                         │
│  submission           │                                         │
│  ├── id (int)         │                                         │
│  ├── exerciseId (FK)  │                                         │
│  └── status           │                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Migrations Order

When creating migrations, follow this order:

1. `category` (no dependencies)
2. `challenge` (depends on `category`)
3. `userProfile` (depends on `user` from Better Auth)
4. `exercise` (depends on `userProfile` and `challenge`)
5. `submission` (depends on `exercise`)