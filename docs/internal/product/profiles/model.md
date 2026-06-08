# Profiles — Database Model

**Last updated:** 2026-06-08

---

## Table: `userProfile`

Application-level user data including gamification and progress tracking.

```typescript
import { pgTable, integer, text, timestamp, index } from "drizzle-orm/pg-core";

export const userProfile = pgTable("user_profile", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull().unique(), // UUID from Better Auth user
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(0),
  streak: integer("streak").notNull().default(0), // consecutive days
  lastActivityAt: timestamp("last_activity_at"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("user_profile_user_id_idx").on(table.userId),
  index("user_profile_xp_idx").on(table.xp.desc()), // leaderboard
]);
```

---

## Relationships

```typescript
import { relations } from "drizzle-orm";

export const userProfileRelations = relations(userProfile, ({ one, many }) => ({
  // Links to Better Auth user via email (not a direct FK)
  exercises: many(exercise),
}));
```

---

## Fields

| Field | Type | Drizzle | Description |
|-------|------|---------|-------------|
| `id` | `INTEGER` | `.primaryKey().generatedAlwaysAsIdentity()` | Primary key |
| `userId` | `TEXT` | `.notNull().unique()` | UUID from Better Auth user |
| `level` | `INTEGER` | `.notNull().default(1)` | User level (1-100) |
| `xp` | `INTEGER` | `.notNull().default(0)` | Experience points |
| `streak` | `INTEGER` | `.notNull().default(0)` | Consecutive active days |
| `lastActivityAt` | `TIMESTAMP` | | Last challenge activity |
| `avatarUrl` | `TEXT` | | Custom avatar URL |
| `createdAt` | `TIMESTAMP` | `.defaultNow().notNull()` | Creation timestamp |
| `updatedAt` | `TIMESTAMP` | `.defaultNow().notNull()` | Last update timestamp |

---

## XP System

XP is earned by completing challenges:

| Difficulty | XP Reward |
|------------|-----------|
| Easy | 100 XP |
| Medium | 200 XP |
| Hard | 300 XP |

Level thresholds (example):
- Level 1: 0 XP
- Level 2: 500 XP
- Level 3: 1500 XP
- etc.

---

## Queries (Drizzle)

### Get user profile by Better Auth user ID
```typescript
import { eq } from "drizzle-orm";

const profile = await db.query.userProfile.findFirst({
  where: eq(userProfile.userId, userId),
});
```

### Leaderboard (top 10 by XP)
```typescript
const leaderboard = await db.query.userProfile.findMany({
  orderBy: desc(userProfile.xp),
  limit: 10,
});
```

### Update streak on activity
```typescript
await db.update(userProfile)
  .set({
    streak: sql`CASE
      WHEN last_activity_at < yesterday THEN 0
      WHEN last_activity_at >= yesterday THEN streak + 1
      ELSE streak
    END`,
    lastActivityAt: new Date(),
    updatedAt: new Date(),
  })
  .where(eq(userProfile.userId, userId));
```
