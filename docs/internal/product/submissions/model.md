# Submissions — Database Model

**Last updated:** 2026-06-08

---

## Table: `submission`

A submission is a final attempt. Created when user clicks "Submit" (vs "Run").

```sql
CREATE TABLE submission (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  exercise_id INTEGER NOT NULL REFERENCES exercise(id),
  status VARCHAR(50) NOT NULL, -- passed | failed | error | timeout
  code TEXT,
  language VARCHAR(20),
  test_results JSONB,                                 -- per test case results
  execution_time INTEGER,                             -- ms
  memory_used FLOAT,                                  -- MB
  error_message TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP                               -- soft-delete
);

-- Indexes
CREATE INDEX submission_exercise_id_idx ON submission(exercise_id);
CREATE INDEX submission_created_at_idx ON submission(created_at DESC);
CREATE INDEX submission_status_idx ON submission(status);
CREATE INDEX submission_deleted_at_idx ON submission(deleted_at) WHERE deleted_at IS NULL;
```

---

## Relationships

```
exercise ──────────────► submission
  id (PK)                 exercise_id (FK)
```

One exercise has many submissions (all attempts).

---

## Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `INTEGER` | PK, auto-increment | Primary key |
| `exercise_id` | `INTEGER` | NOT NULL, FK | Reference to exercise |
| `status` | `VARCHAR(50)` | NOT NULL | passed, failed, error, timeout |
| `code` | `TEXT` | nullable | Submitted code |
| `language` | `VARCHAR(20)` | nullable | Programming language |
| `test_results` | `JSONB` | nullable | Per-test results |
| `execution_time` | `INTEGER` | nullable | Execution time (ms) |
| `memory_used` | `FLOAT` | nullable | Memory used (MB) |
| `error_message` | `TEXT` | nullable | Error output |
| `created_at` | `TIMESTAMP` | NOT NULL | Submission timestamp |
| `deleted_at` | `TIMESTAMP` | nullable | Soft-delete marker |

---

## Status Values

| Status | Description |
|--------|-------------|
| `passed` | All tests passed |
| `failed` | Some tests failed (wrong answer) |
| `error` | Runtime error (exception, syntax error) |
| `timeout` | Execution exceeded time limit |

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

### Get user's submission history
```sql
SELECT s.*, c.title AS challenge_title, c.slug AS challenge_slug
FROM submission s
JOIN exercise e ON e.id = s.exercise_id
JOIN challenge c ON c.id = e.challenge_id
WHERE e.user_id = $1 AND s.deleted_at IS NULL
ORDER BY s.created_at DESC
LIMIT 20;
```

### Get latest submission for exercise
```sql
SELECT * FROM submission
WHERE exercise_id = $1 AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 1;
```

### Get submissions by challenge (for analytics)
```sql
SELECT
  s.status,
  COUNT(*) AS count,
  AVG(s.execution_time) AS avg_execution_time,
  AVG(s.memory_used) AS avg_memory_used
FROM submission s
JOIN exercise e ON e.id = s.exercise_id
WHERE e.challenge_id = $1 AND s.deleted_at IS NULL
GROUP BY s.status;
```

### Create submission
```sql
INSERT INTO submission (exercise_id, status, code, language, test_results, execution_time, memory_used, error_message)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING *;
```

### Update challenge stats after submission
```sql
UPDATE challenge
SET
  acceptance_rate = (
    SELECT CAST(SUM(CASE WHEN status = 'passed' THEN 1 ELSE 0 END) AS FLOAT)
    / NULLIF(COUNT(*), 0)
    FROM submission
    WHERE exercise_id IN (
      SELECT id FROM exercise WHERE challenge_id = $1
    )
  ),
  total_attempts = total_attempts + 1,
  updated_at = NOW()
WHERE id = $1;
```

### Award XP on passing submission
```sql
-- Trigger or procedure to award XP
UPDATE user_profile
SET
  xp = xp + CASE
    WHEN c.difficulty = 'easy' THEN 100
    WHEN c.difficulty = 'medium' THEN 200
    WHEN c.difficulty = 'hard' THEN 300
  END,
  updated_at = NOW()
FROM exercise e
JOIN challenge c ON c.id = e.challenge_id
WHERE e.id = $1 AND user_profile.id = e.user_id;
```
