# Exercices — Database Model

**Last updated:** 2026-06-08

---

## Table: `exercise`

An exercise represents a user's interaction with a challenge. Created when user starts a challenge.

```sql
CREATE TABLE exercise (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER NOT NULL REFERENCES user_profile(id),
  challenge_id INTEGER NOT NULL REFERENCES challenge(id),
  status VARCHAR(50) NOT NULL DEFAULT 'in-progress', -- in-progress | submitted | passed | failed
  code TEXT,
  language VARCHAR(20),                              -- js | ts | python
  test_cases JSONB,                                   -- copied from challenge at creation
  test_results JSONB,                                 -- per test case results
  execution_time INTEGER,                             -- ms
  memory_used FLOAT,                                  -- MB
  error_message TEXT,
  submitted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP                               -- soft-delete
);

-- Indexes
CREATE UNIQUE INDEX exercise_user_challenge_idx ON exercise(user_id, challenge_id);
CREATE INDEX exercise_user_id_idx ON exercise(user_id);
CREATE INDEX exercise_challenge_id_idx ON exercise(challenge_id);
CREATE INDEX exercise_status_idx ON exercise(status);
CREATE INDEX exercise_deleted_at_idx ON exercise(deleted_at) WHERE deleted_at IS NULL;
```

---

## Relationships

```
userProfile ──────────► exercise ──────────────► challenge
  id (PK)                 user_id (FK)              challenge_id (FK)
 │
                                ▼
                          submission
                            exercise_id (FK)
```

One user has many exercises.
One challenge has many exercises.
One exercise has many submissions.

---

## Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `INTEGER` | PK, auto-increment | Primary key |
| `user_id` | `INTEGER` | NOT NULL, FK | Reference to user_profile |
| `challenge_id` | `INTEGER` | NOT NULL, FK | Reference to challenge |
| `status` | `VARCHAR(50)` | NOT NULL, DEFAULT 'in-progress' | Current status |
| `code` | `TEXT` | nullable | User's current code |
| `language` | `VARCHAR(20)` | nullable | Programming language |
| `test_cases` | `JSONB` | nullable | Copied from challenge |
| `test_results` | `JSONB` | nullable | Per-test results |
| `execution_time` | `INTEGER` | nullable | Execution time (ms) |
| `memory_used` | `FLOAT` | nullable | Memory used (MB) |
| `error_message` | `TEXT` | nullable | Error output |
| `submitted_at` | `TIMESTAMP` | nullable | First submission time |
| `created_at` | `TIMESTAMP` | NOT NULL | Creation timestamp |
| `updated_at` | `TIMESTAMP` | NOT NULL | Last update timestamp |
| `deleted_at` | `TIMESTAMP` | nullable | Soft-delete marker |

---

## Status Flow

```
in-progress ──► submitted ──► passed
     │                           │
     │                           ▼
     │ failed
     │
     └──────────────────────► failed
```

- `in-progress`: User has started but not submitted
- `submitted`: User clicked Submit, awaiting results
- `passed`: All tests passed
- `failed`: Tests failed or error/timeout

---

## Test Results Schema

```json
{
  "results": [
    {
      "testIndex": 0,
      "input": [2, 7, 11, 15],
      "expected": [0, 1],
      "actual": [0, 1],
      "passed": true,
      "executionTime": 1.2,
      "memoryUsed": 2.1
    },
    {
      "testIndex": 1,
      "input": [3, 2, 4],
      "expected": [1, 2],
      "actual": null,
      "passed": false,
      "error": "Time limit exceeded"
    }
  ],
  "summary": {
    "total": 5,
    "passed": 3,
    "failed": 2,
    "executionTime": 120,
    "memoryUsed": 8.5
  }
}
```

---

## Queries

### Get user's exercise for a challenge
```sql
SELECT * FROM exercise
WHERE user_id = $1 AND challenge_id = $2 AND deleted_at IS NULL;
```

### Get user's in-progress exercises
```sql
SELECT e.*, c.title, c.difficulty, c.slug
FROM exercise e
JOIN challenge c ON c.id = e.challenge_id
WHERE e.user_id = $1
  AND e.status = 'in-progress'
  AND e.deleted_at IS NULL
ORDER BY e.updated_at DESC;
```

### Get exercises by challenge (for leaderboard)
```sql
SELECT e.*, u.level, u.xp, u.avatar_url
FROM exercise e
JOIN user_profile u ON u.id = e.user_id
WHERE e.challenge_id = $1
  AND e.status = 'passed'
  AND e.deleted_at IS NULL
ORDER BY e.execution_time ASC
LIMIT 10;
```

### Create exercise on challenge start
```sql
INSERT INTO exercise (user_id, challenge_id, test_cases)
SELECT $1, $2, test_cases
FROM challenge
WHERE id = $2
RETURNING *;
```

### Update exercise on run
```sql
UPDATE exercise
SET
  code = $3,
  language = $4,
  test_results = $5,
  execution_time = $6,
  memory_used = $7,
  error_message = $8,
  updated_at = NOW()
WHERE id = $1
RETURNING *;
```

### Mark exercise as passed
```sql
UPDATE exercise
SET
  status = 'passed',
  submitted_at = NOW(),
  updated_at = NOW()
WHERE id = $1
RETURNING *;
```
