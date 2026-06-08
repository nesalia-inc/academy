import type { Metadata } from "next"
import { Hero } from "@/components/home/hero"
import { Features } from "@/components/home/features"
import { ParcoursSection } from "@/components/home/parcours-section"
import { FAQ } from "@/components/home/faq"
import { HomeFooter } from "@/components/home/home-footer"
import { CtaCard } from "@/components/cta-card"

export const metadata: Metadata = {
  title: "Academy — From learning to mastering",
  description:
    "Learn software engineering the right way. Start with free parcours. Go all the way to mastery.",
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Hero />
        <Features />
        <ParcoursSection />
        <FAQ />
        <CtaCard />
      </main>
      <HomeFooter />
    </div>
  )
}