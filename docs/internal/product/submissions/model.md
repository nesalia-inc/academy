# Submissions — Database Model

**Last updated:** 2026-06-08

---

## Table: `submission`

A submission is a final attempt. Created when user clicks "Submit" (vs "Run").

```typescript
import { pgTable, integer, varchar, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { exercise } from "./exercise";

export const submissionStatusEnum = pgEnum("submission_status", [
  "passed",
  "failed",
  "error",
  "timeout",
]);

export const submission = pgTable("submission", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  exerciseId: integer("exercise_id").notNull().references(() => exercise.id),
  status: varchar("status", { length: 50 }).notNull(),
  code: text("code"),
  language: varchar("language", { length: 20 }),
  testResults: jsonb("test_results"), // per test case results
  executionTime: integer("execution_time"), // ms
  memoryUsed: integer("memory_used"), // MB (stored as integer)
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
}, (table) => [
  index("submission_exercise_id_idx").on(table.exerciseId),
  index("submission_created_at_idx").on(table.createdAt.desc()),
  index("submission_status_idx").on(table.status),
  index("submission_deleted_at_idx").on(table.deletedAt), // soft-delete filter
]);
```

---

## Relationships

```typescript
import { relations } from "drizzle-orm";

export const submissionRelations = relations(submission, ({ one }) => ({
  exercise: one(exercise, {
    fields: [submission.exerciseId],
    references: [exercise.id],
  }),
}));
```

---

## Fields

| Field | Type | Drizzle | Description |
|-------|------|---------|-------------|
| `id` | `INTEGER` | `.primaryKey().generatedAlwaysAsIdentity()` | Primary key |
| `exerciseId` | `INTEGER` | `.notNull().references(() => exercise.id)` | Reference to exercise |
| `status` | `VARCHAR(50)` | `.notNull()` | passed, failed, error, timeout |
| `code` | `TEXT` | | Submitted code |
| `language` | `VARCHAR(20)` | | Programming language |
| `testResults` | `JSONB` | | Per-test results |
| `executionTime` | `INTEGER` | | Execution time (ms) |
| `memoryUsed` | `INTEGER` | | Memory used (MB) |
| `errorMessage` | `TEXT` | | Error output |
| `createdAt` | `TIMESTAMP` | `.defaultNow().notNull()` | Submission timestamp |
| `deletedAt` | `TIMESTAMP` | | Soft-delete marker |

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

```typescript
interface TestResults {
  results: Array<{
    testIndex: number;
    input: unknown[];
    expected: unknown;
    actual: unknown | null;
    passed: boolean;
    executionTime: number;
    memoryUsed: number;
  }>;
  summary: {
    total: number;
    passed: number;
    failed: number;
    executionTime: number;
    memoryUsed: number;
  };
}
```

---

## Queries (Drizzle)

### Get user's submission history
```typescript
import { isNull, desc } from "drizzle-orm";

const history = await db.query.submission.findMany({
  with: {
    exercise: {
      with: {
        challenge: {
          columns: { title: true, slug: true },
        },
      },
    },
  },
  orderBy: desc(submission.createdAt),
  limit: 20,
});
```

### Get latest submission for exercise
```typescript
import { isNull, desc } from "drizzle-orm";

const latest = await db.query.submission.findFirst({
  where: and(
    eq(submission.exerciseId, exerciseId),
    isNull(submission.deletedAt)
  ),
  orderBy: desc(submission.createdAt),
});
```

### Get submissions by challenge (for analytics)
```typescript
import { isNull, sql } from "drizzle-orm";

const analytics = await db.query.submission.findMany({
  with: {
    exercise: {
      columns: { challengeId: true },
    },
  },
  where: and(
    eq(exercise.challengeId, challengeId),
    isNull(submission.deletedAt)
  ),
});

// Group by status
const grouped = analytics.reduce((acc, sub) => {
  acc[sub.status] = (acc[sub.status] || 0) + 1;
  return acc;
}, {});
```

### Create submission
```typescript
const newSubmission = await db.insert(submission).values({
  exerciseId,
  status,
  code,
  language,
  testResults,
  executionTime,
  memoryUsed,
  errorMessage,
}).returning();
```

### Update challenge stats after submission
```typescript
import { eq, sql } from "drizzle-orm";

await db.update(challenge)
  .set({
    acceptanceRate: sql`(
      SELECT CAST(SUM(CASE WHEN status = 'passed' THEN 1 ELSE 0 END) AS INTEGER)
      FROM submission
      WHERE exercise_id IN (
        SELECT id FROM exercise WHERE challenge_id = ${challengeId}
      )
    )`,
    totalAttempts: sql`total_attempts + 1`,
    updatedAt: new Date(),
  })
  .where(eq(challenge.id, challengeId));
```

### Award XP on passing submission
```typescript
import { eq } from "drizzle-orm";

const xpReward = {
  easy: 100,
  medium: 200,
  hard: 300,
};

await db.update(userProfile)
  .set({
    xp: sql`xp + ${xpReward[difficulty]}`,
    updatedAt: new Date(),
  })
  .where(eq(userProfile.id, userId));
```
