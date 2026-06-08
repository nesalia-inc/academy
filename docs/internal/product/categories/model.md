# Categories — Database Model

**Last updated:** 2026-06-08

---

## Table: `category`

Challenge categories (e.g., Arrays, Trees, Dynamic Programming).

```typescript
import { pgTable, integer, varchar, text, timestamp, index } from "drizzle-orm/pg-core";

export const category = pgTable("category", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  icon: varchar("icon", { length: 50 }), // emoji or icon name
  color: varchar("color", { length: 20 }), // UI color (e.g., blue, green)
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
}, (table) => [
  index("category_slug_idx").on(table.slug),
  index("category_sort_order_idx").on(table.sortOrder),
  index("category_deleted_at_idx").on(table.deletedAt), // soft-delete filter
]);
```

---

## Relationships

```typescript
import { relations } from "drizzle-orm";

export const categoryRelations = relations(category, ({ one, many }) => ({
  challenges: many(challenge),
}));
```

---

## Fields

| Field | Type | Drizzle | Description |
|-------|------|---------|-------------|
| `id` | `INTEGER` | `.primaryKey().generatedAlwaysAsIdentity()` | Primary key |
| `name` | `VARCHAR(100)` | `.notNull()` | Display name (e.g., "Arrays") |
| `slug` | `VARCHAR(100)` | `.notNull().unique()` | URL-friendly name (e.g., "arrays") |
| `icon` | `VARCHAR(50)` | | Emoji or icon identifier |
| `color` | `VARCHAR(20)` | | UI color variant |
| `description` | `TEXT` | | Category description |
| `sortOrder` | `INTEGER` | `.notNull().default(0)` | Display ordering |
| `createdAt` | `TIMESTAMP` | `.defaultNow().notNull()` | Creation timestamp |
| `updatedAt` | `TIMESTAMP` | `.defaultNow().notNull()` | Last update timestamp |
| `deletedAt` | `TIMESTAMP` | | Soft-delete marker |

---

## Seed Data

```typescript
import { category } from "./schema";

await db.insert(category).values([
  { name: "Arrays", slug: "arrays", icon: "📊", color: "blue", sortOrder: 1 },
  { name: "Strings", slug: "strings", icon: "🔤", color: "green", sortOrder: 2 },
  { name: "Linked Lists", slug: "linked-lists", icon: "🔗", color: "purple", sortOrder: 3 },
  { name: "Trees", slug: "trees", icon: "🌳", color: "orange", sortOrder: 4 },
  { name: "Dynamic Programming", slug: "dynamic-programming", icon: "📈", color: "red", sortOrder: 5 },
  { name: "Graphs", slug: "graphs", icon: "🕸️", color: "pink", sortOrder: 6 },
]);
```

---

## Queries (Drizzle)

### List all active categories
```typescript
import { isNull, asc } from "drizzle-orm";

const categories = await db.query.category.findMany({
  where: isNull(category.deletedAt),
  orderBy: asc(category.sortOrder),
});
```

### Get category by slug
```typescript
import { and, eq, isNull } from "drizzle-orm";

const cat = await db.query.category.findFirst({
  where: and(
    eq(category.slug, slug),
    isNull(category.deletedAt)
  ),
});
```

### Get category with challenge count
```typescript
import { isNull, sql } from "drizzle-orm";

const categoriesWithCount = await db.query.category.findMany({
  where: isNull(category.deletedAt),
  with: {
    challenges: {
      where: isNull(challenge.deletedAt),
      columns: { id: true },
    },
  },
});

// Transform to add count
const result = categoriesWithCount.map(cat => ({
  ...cat,
  challengeCount: cat.challenges.length,
}));
```
