import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const freeParcours = [
  {
    title: "JavaScript Fundamentals",
    challenges: 15,
    difficulty: "Beginner",
  },
  {
    title: "SQL Basics",
    challenges: 20,
    difficulty: "Beginner",
  },
  {
    title: "React Essentials",
    challenges: 18,
    difficulty: "Intermediate",
  },
]

const paidParcours = [
  {
    title: "Production-Ready React",
    challenges: 25,
    difficulty: "Advanced",
  },
  {
    title: "Database Design Mastery",
    challenges: 30,
    difficulty: "Advanced",
  },
]

export function ParcoursSection() {
  return (
    <section id="mastery" className="bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 border-x border-t border-border py-16">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.1] text-foreground">
            Choose your path.
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Start free, go all the way to mastery.
          </p>
        </div>

        {/* Free parcours */}
        <div className="mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-x divide-border border border-border">
            {freeParcours.map((parcours) => (
              <div key={parcours.title} className="p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Free
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {parcours.difficulty}
                  </span>
                </div>
                <h4 className="font-medium text-foreground">{parcours.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {parcours.challenges} challenges
                </p>
                <Button variant="default" size="sm" asChild className="w-full mt-auto">
                  <Link href="/challenges">Start</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Paid parcours */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-border border border-border">
            {paidParcours.map((parcours) => (
              <div key={parcours.title} className="p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-xs">
                    Paid
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {parcours.difficulty}
                  </span>
                </div>
                <h4 className="font-medium text-foreground">{parcours.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {parcours.challenges} challenges
                </p>
                <Button variant="secondary" size="sm" asChild className="w-full mt-auto">
                  <Link href="/challenges">Start mastery</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}