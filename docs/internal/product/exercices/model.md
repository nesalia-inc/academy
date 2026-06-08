# Exercices — Database Model

**Last updated:** 2026-06-08

---

## Table: `exercise`

An exercise represents a user's interaction with a challenge. Created when user starts a challenge.

```typescript
import { pgTable, integer, varchar, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { userProfile } from "./userProfile";
import { challenge } from "./challenge";

export const exerciseStatusEnum = pgEnum("exercise_status", [
  "in-progress",
  "submitted",
  "passed",
  "failed",
]);

export const exercise = pgTable("exercise", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => userProfile.id),
  challengeId: integer("challenge_id").notNull().references(() => challenge.id),
  status: varchar("status", { length: 50 }).notNull().default("in-progress"),
  code: text("code"),
  language: varchar("language", { length: 20 }), // js | ts | python
  testCases: jsonb("test_cases"), // copied from challenge at creation
  testResults: jsonb("test_results"), // per test case results
  executionTime: integer("execution_time"), // ms
  memoryUsed: integer("memory_used"), // MB (stored as integer)
  errorMessage: text("error_message"),
  submittedAt: timestamp("submitted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
}, (table) => [
  index("exercise_user_challenge_idx").on(table.userId, table.challengeId), // unique constraint
  index("exercise_user_id_idx").on(table.userId),
  index("exercise_challenge_id_idx").on(table.challengeId),
  index("exercise_status_idx").on(table.status),
  index("exercise_deleted_at_idx").on(table.deletedAt), // soft-delete filter
]);
```

---

## Relationships

```typescript
import { relations } from "drizzle-orm";

export const exerciseRelations = relations(exercise, ({ one, many }) => ({
  user: one(userProfile, {
    fields: [exercise.userId],
    references: [userProfile.id],
  }),
  challenge: one(challenge, {
    fields: [exercise.challengeId],
    references: [challenge.id],
  }),
  submissions: many(submission),
}));
```

---

## Fields

| Field | Type | Drizzle | Description |
|-------|------|---------|-------------|
| `id` | `INTEGER` | `.primaryKey().generatedAlwaysAsIdentity()` | Primary key |
| `userId` | `INTEGER` | `.notNull().references(() => userProfile.id)` | Reference to user_profile |
| `challengeId` | `INTEGER` | `.notNull().references(() => challenge.id)` | Reference to challenge |
| `status` | `VARCHAR(50)` | `.notNull().default("in-progress")` | Current status |
| `code` | `TEXT` | | User's current code |
| `language` | `VARCHAR(20)` | | Programming language |
| `testCases` | `JSONB` | | Copied from challenge |
| `testResults` | `JSONB` | | Per-test results |
| `executionTime` | `INTEGER` | | Execution time (ms) |
| `memoryUsed` | `INTEGER` | | Memory used (MB) |
| `errorMessage` | `TEXT` | | Error output |
| `submittedAt` | `TIMESTAMP` | | First submission time |
| `createdAt` | `TIMESTAMP` | `.defaultNow().notNull()` | Creation timestamp |
| `updatedAt` | `TIMESTAMP` | `.defaultNow().notNull()` | Last update timestamp |
| `deletedAt` | `TIMESTAMP` | | Soft-delete marker |

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

### Get user's exercise for a challenge
```typescript
import { and, eq, isNull } from "drizzle-orm";

const userExercise = await db.query.exercise.findFirst({
  where: and(
    eq(exercise.userId, userId),
    eq(exercise.challengeId, challengeId),
    isNull(exercise.deletedAt)
  ),
});
```

### Get user's in-progress exercises
```typescript
import { and, eq, isNull, desc } from "drizzle-orm";

const inProgress = await db.query.exercise.findMany({
  where: and(
    eq(exercise.userId, userId),
    eq(exercise.status, "in-progress"),
    isNull(exercise.deletedAt)
  ),
  with: {
    challenge: {
      columns: { title: true, difficulty: true, slug: true },
    },
  },
  orderBy: desc(exercise.updatedAt),
});
```

### Get exercises by challenge (for leaderboard)
```typescript
import { and, eq, isNull, asc } from "drizzle-orm";

const leaderboard = await db.query.exercise.findMany({
  where: and(
    eq(exercise.challengeId, challengeId),
    eq(exercise.status, "passed"),
    isNull(exercise.deletedAt)
  ),
  with: {
    user: {
      columns: { level: true, xp: true, avatarUrl: true },
    },
  },
  orderBy: asc(exercise.executionTime),
  limit: 10,
});
```

### Create exercise on challenge start
```typescript
import { isNull } from "drizzle-orm";

const challengeData = await db.query.challenge.findFirst({
  where: and(
    eq(challenge.id, challengeId),
    isNull(challenge.deletedAt)
  ),
});

const newExercise = await db.insert(exercise).values({
  userId,
  challengeId,
  testCases: challengeData?.testCases,
}).returning();
```

### Update exercise on run
```typescript
await db.update(exercise)
  .set({
    code,
    language,
    testResults,
    executionTime,
    memoryUsed,
    errorMessage,
    updatedAt: new Date(),
  })
  .where(eq(exercise.id, exerciseId));
```

### Mark exercise as passed
```typescript
await db.update(exercise)
  .set({
    status: "passed",
    submittedAt: new Date(),
    updatedAt: new Date(),
  })
  .where(eq(exercise.id, exerciseId));
```
