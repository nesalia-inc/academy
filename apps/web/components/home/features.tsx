import Link from "next/link"

const features = [
  {
    title: "Structured Learning Paths",
    description:
      "Not random challenges. Real learning paths. Every parcours is designed to take you from A to Z.",
    href: "/challenges",
  },
  {
    title: "All the Skills You Need",
    description:
      "Algorithms, SQL, React, system design. All in one place. From basics to advanced engineering.",
    href: "/challenges/categories",
  },
  {
    title: "See Your Progress",
    description:
      "XP, levels, streaks. Gamification that works. Track your growth and stay motivated.",
    href: "#",
  },
  {
    title: "Free to Start, Deep When Ready",
    description:
      "Begin with free content. When you're ready, unlock the full mastery path.",
    href: "#mastery",
  },
]

const secondaryFeatures = [
  {
    title: "Code Execution",
    description:
      'Instant feedback with our sandboxed execution environment. Run and test your code in real-time.',
    href: "#",
  },
  {
    title: "Multiple Languages",
    description:
      "Practice in JavaScript, TypeScript, or Python. Switch between languages with a single click.",
    href: "#",
  },
  {
    title: "Daily Challenges",
    description:
      "Keep your streak alive with a new challenge every day. Consistency builds mastery.",
    href: "#",
  },
]

export function Features() {
  return (
    <section className="bg-background-secondary">
      <div className="max-w-6xl mx-auto px-6 border-x border border-border p-6">
        
        <div className="grid lg:grid-cols-6 gap-4">
          {/* Main features - spans 3 columns each */}
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="lg:col-span-3 border border-border bg-card hover:border-accent hover:bg-secondary rounded-none p-6 transition-colors"
            >
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                {feature.title}
              </h3>
              <p className="mt-1.5 text-[15px] text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Link>
          ))}

          {/* Secondary features - spans 2 columns */}
          {secondaryFeatures.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="lg:col-span-2 border border-border bg-card hover:border-accent hover:bg-secondary rounded-none p-6 transition-colors"
            >
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                {feature.title}
              </h3>
              <p className="mt-1.5 text-[15px] text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}