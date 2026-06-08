# Profiles — Database Model

**Last updated:** 2026-06-08

---

## Table: `userProfile`

Application-level user data including gamification and progress tracking.

```sql
CREATE TABLE user_profile (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id TEXT NOT NULL,                          -- FK to better_auth.user.id (UUID)
  level INTEGER NOT NULL DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0, -- consecutive days
  last_activity_at TIMESTAMP,                      -- nullable
  avatar_url TEXT,                                 -- nullable
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX user_profile_user_id_idx ON user_profile(user_id);
CREATE INDEX user_profile_xp_idx ON user_profile(xp DESC);  -- leaderboard
```

---

## Relationships

```
user (Better Auth) ──────► userProfile
      id (UUID)              user_id (FK via email link)
```

The `userProfile` links to Better Auth `user` via email (not a direct FK, matched by email).

---

## Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `INTEGER` | PK, auto-increment | Primary key |
| `user_id` | `TEXT` | NOT NULL, UNIQUE | UUID from Better Auth user |
| `level` | `INTEGER` | NOT NULL, DEFAULT 1 | User level (1-100) |
| `xp` | `INTEGER` | NOT NULL, DEFAULT 0 | Experience points |
| `streak` | `INTEGER` | NOT NULL, DEFAULT 0 | Consecutive active days |
| `last_activity_at` | `TIMESTAMP` | nullable | Last challenge activity |
| `avatar_url` | `TEXT` | nullable | Custom avatar URL |
| `created_at` | `TIMESTAMP` | NOT NULL | Creation timestamp |
| `updated_at` | `TIMESTAMP` | NOT NULL | Last update timestamp |

---

## XP System

XP is earned by completing challenges:

| Difficulty | XP Reward |
|------------|----------|
| Easy | 100 XP |
| Medium | 200 XP |
| Hard | 300 XP |

Level thresholds (example):
- Level 1: 0 XP
- Level 2: 500 XP
- Level 3: 1500 XP
- etc.

---

## Queries

### Get user profile by Better Auth user ID
```sql
SELECT * FROM user_profile WHERE user_id = $1;
```

### Leaderboard (top 10 by XP)
```sql
SELECT id, level, xp, avatar_url
FROM user_profile
ORDER BY xp DESC
LIMIT 10;
```

### Update streak on activity
```sql
UPDATE user_profile
SET
  streak = CASE
    WHEN last_activity_at < yesterday THEN0
    WHEN last_activity_at >= yesterday THEN streak + 1
    ELSE streak
  END,
  last_activity_at = NOW(),
  updated_at = NOW()
WHERE user_id = $1;
```
