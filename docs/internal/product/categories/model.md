# Categories — Database Model

**Last updated:** 2026-06-08

---

## Table: `category`

Challenge categories (e.g., Arrays, Trees, Dynamic Programming).

```sql
CREATE TABLE category (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50),                                -- emoji or icon name
  color VARCHAR(20),                               -- UI color (e.g., blue, green)
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP                             -- soft-delete
);

-- Indexes
CREATE UNIQUE INDEX category_slug_idx ON category(slug);
CREATE INDEX category_sort_order_idx ON category(sort_order);
```

---

## Relationships

```
category ──────────────► challenge
  id (PK)                 category_id (FK)
```

One category can have many challenges.

---

## Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `INTEGER` | PK, auto-increment | Primary key |
| `name` | `VARCHAR(100)` | NOT NULL | Display name (e.g., "Arrays") |
| `slug` | `VARCHAR(100)` | NOT NULL, UNIQUE | URL-friendly name (e.g., "arrays") |
| `icon` | `VARCHAR(50)` | nullable | Emoji or icon identifier |
| `color` | `VARCHAR(20)` | nullable | UI color variant |
| `description` | `TEXT` | nullable | Category description |
| `sort_order` | `INTEGER` | NOT NULL, DEFAULT 0 | Display ordering |
| `created_at` | `TIMESTAMP` | NOT NULL | Creation timestamp |
| `updated_at` | `TIMESTAMP` | NOT NULL | Last update timestamp |
| `deleted_at` | `TIMESTAMP` | nullable | Soft-delete marker |

---

## Seed Data

```sql
INSERT INTO category (name, slug, icon, color, sort_order) VALUES
  ('Arrays', 'arrays', '📊', 'blue', 1),
  ('Strings', 'strings', '🔤', 'green', 2),
  ('Linked Lists', 'linked-lists', '🔗', 'purple', 3),
  ('Trees', 'trees', '🌳', 'orange', 4),
  ('Dynamic Programming', 'dynamic-programming', '📈', 'red', 5),
  ('Graphs', 'graphs', '🕸️', 'pink', 6);
```

---

## Queries

### List all active categories
```sql
SELECT * FROM category
WHERE deleted_at IS NULL
ORDER BY sort_order;
```

### Get category by slug
```sql
SELECT * FROM category
WHERE slug = $1 AND deleted_at IS NULL;
```

### Get category with challenge count
```sql
SELECT
  c.*,
  COUNT(ch.id) AS challenge_count
FROM category c
LEFT JOIN challenge ch ON ch.category_id = c.id AND ch.deleted_at IS NULL
WHERE c.deleted_at IS NULL
GROUP BY c.id
ORDER BY c.sort_order;
```
