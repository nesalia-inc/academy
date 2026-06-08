# Challenges — Database Model

**Last updated:** 2026-06-08

---

## Table: `challenge`

The challenge definition. One challenge can have many exercises (one per user attempt).

```typescript
import { pgTable, integer, varchar, text, timestamp, index, jsonb } from "drizzle-orm/pg-core";
import { category } from "./category";

export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);
export const challengeTypeEnum = pgEnum("challenge_type", ["coding", "mcq", "fill-blank"]);

export const challenge = pgTable("challenge", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  categoryId: integer("category_id").notNull().references(() => category.id),
  type: varchar("type", { length: 50 }).notNull().default("coding"),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  difficulty: varchar("difficulty", { length: 20 }).notNull(), // easy | medium | hard
  solution: text("solution"), // hidden until solved
  acceptanceRate: integer("acceptance_rate").notNull().default(0), // stored as integer (0-100)
  totalAttempts: integer("total_attempts").notNull().default(0),
  starterCode: jsonb("starter_code"), // { "solution.js": "...", "tests.js": "..." }
  testCases: jsonb("test_cases"), // [{ "input": [...], "output": [...] }]
  testTimeout: integer("test_timeout"), // ms
  timeLimit: integer("time_limit"), // ms
  memoryLimit: integer("memory_limit"), // MB
  languages: jsonb("languages"), // ["js", "ts", "python"]
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
}, (table) => [
  index("challenge_slug_idx").on(table.slug),
  index("challenge_category_id_idx").on(table.categoryId),
  index("challenge_difficulty_idx").on(table.difficulty),
  index("challenge_created_at_idx").on(table.createdAt.desc()),
  index("challenge_deleted_at_idx").on(table.deletedAt), // soft-delete filter
]);
```

---

## Relationships

```typescript
import { relations } from "drizzle-orm";

export const challengeRelations = relations(challenge, ({ one, many }) => ({
  category: one(category, {
    fields: [challenge.categoryId],
    references: [category.id],
  }),
  exercises: many(exercise),
}));
```

---

## Fields

| Field | Type | Drizzle | Description |
|-------|------|---------|-------------|
| `id` | `INTEGER` | `.primaryKey().generatedAlwaysAsIdentity()` | Primary key |
| `categoryId` | `INTEGER` | `.notNull().references(() => category.id)` | Reference to category |
| `type` | `VARCHAR(50)` | `.notNull().default("coding")` | Challenge type |
| `title` | `VARCHAR(255)` | `.notNull()` | Display title |
| `slug` | `VARCHAR(255)` | `.notNull().unique()` | URL-friendly name |
| `description` | `TEXT` | | Markdown description |
| `difficulty` | `VARCHAR(20)` | `.notNull()` | easy, medium, or hard |
| `solution` | `TEXT` | | Hidden solution (unlocked on solve) |
| `acceptanceRate` | `INTEGER` | `.notNull().default(0)` | Percentage (0-100) |
| `totalAttempts` | `INTEGER` | `.notNull().default(0)` | Total submission count |
| `starterCode` | `JSONB` | | Initial code files |
| `testCases` | `JSONB` | | Test inputs/outputs |
| `testTimeout` | `INTEGER` | | Per-test timeout (ms) |
| `timeLimit` | `INTEGER` | | Overall time limit (ms) |
| `memoryLimit` | `INTEGER` | | Memory limit (MB) |
| `languages` | `JSONB` | | Supported languages |
| `createdAt` | `TIMESTAMP` | `.defaultNow().notNull()` | Creation timestamp |
| `updatedAt` | `TIMESTAMP` | `.defaultNow().notNull()` | Last update timestamp |
| `deletedAt` | `TIMESTAMP` | | Soft-delete marker |

---

## Challenge Types

### Type: `coding` (initial)

```typescript
const starterCode = {
  "solution.js": "function solve() {\n  // your code\n}",
  "tests.js": "module.exports = [{ input: 1, output: 2 }]"
};

const testCases = [
  { input: [2, 7, 11, 15], output: [0, 1] }
];
```

### Type: `mcq` (future)

```typescript
const mcqData = {
  type: "mcq",
  question: "Which sorting algorithm has O(n log n) average case?",
  options: ["Bubble Sort", "Quick Sort", "Linear Search", "Insertion Sort"],
  correctOption: 1,
  shuffleOptions: true,
  explanation: "Quick Sort has O(n log n) average case complexity."
};
```

### Type: `fill-blank` (future)

```typescript
const fillBlankData = {
  type: "fill-blank",
  template: "The time complexity of binary search is O(__).",
  blanks: [
    { position: 35, acceptableAnswers: ["log n", "log(n)", "logn", "log₂n"] }
  ],
  caseSensitive: false
};
```

---

## XP Reward

| Difficulty | XP |
|------------|-----|
| Easy | 100 XP |
| Medium | 200 XP |
| Hard | 300 XP |

---

## Queries (Drizzle)

### Get challenge by slug
```typescript
import { and, eq, isNull } from "drizzle-orm";

const challengeData = await db.query.challenge.findFirst({
  where: and(
    eq(challenge.slug, slug),
    isNull(challenge.deletedAt)
  ),
});
```

### Daily challenge (most recent)
```typescript
import { isNull, desc } from "drizzle-orm";

const daily = await db.query.challenge.findFirst({
  where: isNull(challenge.deletedAt),
  orderBy: desc(challenge.createdAt),
});
```

### Challenges by category
```typescript
import { and, eq, isNull, asc } from "drizzle-orm";

const challenges = await db.query.challenge.findMany({
  where: and(
    eq(challenge.categoryId, categoryId),
    isNull(challenge.deletedAt)
  ),
  orderBy: [asc(challenge.difficulty), asc(challenge.title)],
});
```

### Update acceptance rate after submission
```typescript
import { sql } from "drizzle-orm";

await db.update(challenge)
  .set({
    acceptanceRate: sql`(
      SELECT CAST(SUM(CASE WHEN status = 'passed' THEN 1 ELSE 0 END) AS INTEGER)
      FROM submission s
      JOIN exercise e ON e.id = s.exercise_id
      WHERE e.challenge_id = ${challenge.id}
    )`,
    totalAttempts: sql`total_attempts + 1`,
    updatedAt: new Date(),
  })
  .where(eq(challenge.id, challengeId));
```
