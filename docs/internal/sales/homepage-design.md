# Homepage Design Brief

**Last updated:** 2026-06-08
**Status:** Draft — ready for iteration

---

## Hero

**Tagline:**
> "From learning to mastering. The software engineering path."

**Sub-copy:**
> "Learn software engineering the right way. Start with free parcours. Go all the way to mastery."

**CTAs:**
- Primary: "Start a free parcours"
- Secondary: "Explore mastery paths"

---

## Business Model

| Tier | Content | Hook |
|------|---------|------|
| **Free** | Language/framework basics — what's in docs/packages | Removes barrier |
| **Paid** | SE mastery — engineering judgment, production thinking | The actual value prop |

**Split logic:**
- Free = the "what" (tools, syntax, APIs)
- Paid = the "how" and "why" (SE excellence)

---

## Page Sections

```
┌─────────────────────────────────────┐
│  HERO                               │
│  Tagline + sub-copy + 2 CTAs        │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  FEATURES                           │
│  4 key differentiators              │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  FEATURED PARCOURS                  │
│  Grid of parcours cards             │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  FAQ                                │
│  5-6 common questions               │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  FOOTER                             │
│  Links + brand                      │
└─────────────────────────────────────┘
```

---

## Features Section

**Section title:** "Why practice here?"

### Feature 1: Structured Learning Paths
**Headline:** "Not random challenges. Real learning paths."
**Description:** Every parcours is designed to take you from A to Z. No more piecing together scattered exercises.

### Feature 2: All the Skills You Need
**Headline:** "Algorithms, SQL, React, system design. All in one place."
**Description:** From basics to advanced engineering. One platform to rule them all.

### Feature 3: See Your Progress
**Headline:** "XP, levels, streaks. Feel yourself level up."
**Description:** Gamification that works. Track your growth and stay motivated.

### Feature 4: Free to Start, Deep When Ready
**Headline:** "Start free. Go all the way to mastery."
**Description:** Begin with free content. When you're ready, unlock the full mastery path.

---

## Parcours Section

**Section title:** "Choose your path"

### Free Parcours (examples)
```
┌─────────────────────────────────────────────────────────┐
│  JavaScript Fundamentals                                 │
│  Free • 15 challenges • Beginner                        │
│  [Start]                                                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  SQL Basics                                              │
│  Free • 20 challenges • Beginner                        │
│  [Start]                                                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  React Essentials                                        │
│  Free • 18 challenges • Intermediate                    │
│  [Start]                                                 │
└─────────────────────────────────────────────────────────┘
```

### Paid Parcours (examples)
```
┌─────────────────────────────────────────────────────────┐
│  Production-Ready React                                  │
│  Paid • 25 challenges • Advanced                        │
│  [Start mastery]                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Database Design Mastery                                 │
│  Paid • 30 challenges • Advanced                        │
│  [Start mastery]                                         │
└─────────────────────────────────────────────────────────┘
```

### Card Structure
| Field | Example |
|-------|---------|
| Title | "JavaScript Fundamentals" |
| Tier badge | "Free" or "Paid" |
| Challenge count | "15 challenges" |
| Difficulty | "Beginner / Intermediate / Advanced" |
| CTA | "Start" or "Start mastery" |

---

## FAQ Section

**Section title:** "Questions?"

### Q1: Is it really free?
**A:** Yes. The free parcours are completely free to access. No credit card, no catch. When you're ready to go deeper, unlock the mastery paths.

### Q2: What makes this different from LeetCode or freeCodeCamp?
**A:** We focus on software engineering, not just algorithms. You'll practice SQL, React, system design, and real engineering thinking — all in one place, with a clear path from beginner to advanced.

### Q3: Do I need prior experience?
**A:** No. Our beginner parcours start from scratch. Whether you're new to programming or looking to level up, there's a path for you.

### Q4: How does progress tracking work?
**A:** Earn XP for every challenge you complete. Level up as you progress. Maintain streaks by practicing daily. Your progress is saved and visible on your profile.

### Q5: What technologies do you cover?
**A:** We cover the full software engineering stack: algorithms and data structures, SQL and databases, React and frontend development, system design and architecture. More coming soon.

### Q6: Can I create my own challenges?
**A:** Yes! Our CLI tool lets AI agents (and technical users) create and import challenges programmatically. Content quality is ensured through validation.

---

## Footer

```
┌─────────────────────────────────────────────────────────────────┐
│  FOOTER                                                        │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ Product         │  │ Company         │  │ Legal           │ │
│  │ ─────────────── │  │ ─────────────── │  │ ─────────────── │ │
│  │ Challenges      │  │ About           │  │ Terms           │ │
│  │ Parcours        │  │ Blog            │  │ Privacy         │ │
│  │ Categories      │  │ Contact         │  │                 │ │
│  │                 │  │                 │  │                 │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Powered by Nesalia  |  Made for engineers, by engineers    ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Links

**Product:**
- Challenges
- Parcours (or "Learning Paths")
- Categories

**Company:**
- About
- Blog (or "Engineering Blog")
- Contact

**Legal:**
- Terms of Service
- Privacy Policy

**Bottom bar:**
- "Powered by Nesalia"
- "Made for engineers, by engineers"

---

## Open Questions

- [ ] Parcours card layout — 2-column grid? 3-column?
- [ ] Show difficulty badge on cards?
- [ ] "Parcours" vs "Learning Paths" naming?
- [ ] Footer — show social links (Twitter, GitHub)?
- [ ] Add "How it works" section? (3 steps diagram)

---

## References

- Product docs: `docs/internal/product/`
- Domain model: `docs/internal/product/domain-model.md`
- Parent brand: nesalia.com