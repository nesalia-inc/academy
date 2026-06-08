# Challenges — Database Model

**Last updated:** 2026-06-08

---

## Table: `challenge`

The challenge definition. One challenge can have many exercises (one per user attempt).

```sql
CREATE TABLE challenge (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category_id INTEGER NOT NULL REFERENCES category(id),
  type VARCHAR(50) NOT NULL DEFAULT 'coding',  -- coding | mcq | fill-blank
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  difficulty VARCHAR(20) NOT NULL, -- easy | medium | hard
  solution TEXT,                                 -- hidden until solved
  acceptance_rate FLOAT NOT NULL DEFAULT 0,
  total_attempts INTEGER NOT NULL DEFAULT 0,
  starter_code JSONB,                            -- { "solution.js": "...", "tests.js": "..." }
  test_cases JSONB, -- [{ "input": [...], "output": [...] }]
  test_timeout INTEGER,                          -- ms
  time_limit INTEGER,                            -- ms
  memory_limit INTEGER,                           -- MB
  languages JSONB,                               -- ["js", "ts", "python"]
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP                           -- soft-delete
);

-- Indexes
CREATE UNIQUE INDEX challenge_slug_idx ON challenge(slug);
CREATE INDEX challenge_category_id_idx ON challenge(category_id);
CREATE INDEX challenge_difficulty_idx ON challenge(difficulty);
CREATE INDEX challenge_created_at_idx ON challenge(created_at DESC);
CREATE INDEX challenge_deleted_at_idx ON challenge(deleted_at) WHERE deleted_at IS NULL;
```

---

## Relationships

```
category ──────────────► challenge ──────────────► exercise
  id (PK)                 category_id (FK)         challenge_id (FK)
```

One category has many challenges.
One challenge has many exercises (one per user).

---

## Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `INTEGER` | PK, auto-increment | Primary key |
| `category_id` | `INTEGER` | NOT NULL, FK | Reference to category |
| `type` | `VARCHAR(50)` | NOT NULL, DEFAULT 'coding' | Challenge type |
| `title` | `VARCHAR(255)` | NOT NULL | Display title |
| `slug` | `VARCHAR(255)` | NOT NULL, UNIQUE | URL-friendly name |
| `description` | `TEXT` | | Markdown description |
| `difficulty` | `VARCHAR(20)` | NOT NULL | easy, medium, or hard |
| `solution` | `TEXT` | nullable | Hidden solution (unlocked on solve) |
| `acceptance_rate` | `FLOAT` | NOT NULL, DEFAULT 0 | 0.0 to 1.0 |
| `total_attempts` | `INTEGER` | NOT NULL, DEFAULT 0 | Total submission count |
| `starter_code` | `JSONB` | nullable | Initial code files |
| `test_cases` | `JSONB` | nullable | Test inputs/outputs |
| `test_timeout` | `INTEGER` | nullable | Per-test timeout (ms) |
| `time_limit` | `INTEGER` | nullable | Overall time limit (ms) |
| `memory_limit` | `INTEGER` | nullable | Memory limit (MB) |
| `languages` | `JSONB` | nullable | Supported languages |
| `created_at` | `TIMESTAMP` | NOT NULL | Creation timestamp |
| `updated_at` | `TIMESTAMP` | NOT NULL | Last update timestamp |
| `deleted_at` | `TIMESTAMP` | nullable | Soft-delete marker |

---

## Challenge Types

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

## XP Reward

| Difficulty | XP |
|------------|-----|
| Easy | 100 XP |
| Medium | 200 XP |
| Hard | 300 XP |

---

## Queries

### Get challenge by slug
```sql
SELECT * FROM challenge
WHERE slug = $1 AND deleted_at IS NULL;
```

### Daily challenge (most recent)
```sql
SELECT * FROM challenge
WHERE deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 1;
```

### Challenges by category
```sql
SELECT * FROM challenge
WHERE category_id = $1 AND deleted_at IS NULL
ORDER BY difficulty, title;
```

### Update acceptance rate after submission
```sql
UPDATE challenge
SET
  acceptance_rate = (
    SELECT CAST(SUM(CASE WHEN status = 'passed' THEN 1 ELSE 0 END) AS FLOAT)
    / NULLIF(COUNT(*), 0)
    FROM submission s
    JOIN exercise e ON e.id = s.exercise_id
    WHERE e.challenge_id = $1
  ),
  total_attempts = (
    SELECT COUNT(*) FROM submission s
    JOIN exercise e ON e.id = s.exercise_id
    WHERE e.challenge_id = $1
  ),
  updated_at = NOW()
WHERE id = $1;
```
