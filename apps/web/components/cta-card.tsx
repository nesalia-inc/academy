import Link from "next/link"

export function CtaCard() {
  return (
    <section className="bg-background-secondary border-t border-border">
      <div className="max-w-6xl mx-auto px-6 border-x border border-border py-24">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-[1.1] text-foreground">
              Start your journey.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Free parcours to get you started. Go all the way to mastery when
              you&apos;re ready.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
            <Link
              href="/challenges"
              className="inline-flex items-center gap-2.5 bg-primary hover:bg-primary/90 rounded-none px-6 py-3 text-sm font-medium text-primary-foreground transition-colors"
            >
              Start for free
            </Link>
            <Link
              href="#mastery"
              className="inline-flex items-center gap-2.5 border border-border hover:border-accent bg-card hover:bg-accent/50 rounded-none px-6 py-3 text-sm font-medium text-muted-foreground transition-colors"
            >
              Explore mastery paths
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}