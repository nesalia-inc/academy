"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Is it really free?",
    answer:
      "Yes. The free parcours are completely free to access. No credit card, no catch. When you're ready to go deeper, unlock the mastery paths.",
  },
  {
    question: "What makes this different from LeetCode or freeCodeCamp?",
    answer:
      "We focus on software engineering, not just algorithms. You'll practice SQL, React, system design, and real engineering thinking — all in one place, with a clear path from beginner to advanced.",
  },
  {
    question: "Do I need prior experience?",
    answer:
      "No. Our beginner parcours start from scratch. Whether you're new to programming or looking to level up, there's a path for you.",
  },
  {
    question: "How does progress tracking work?",
    answer:
      "Earn XP for every challenge you complete. Level up as you progress. Maintain streaks by practicing daily. Your progress is saved and visible on your profile.",
  },
  {
    question: "What technologies do you cover?",
    answer:
      "We cover the full software engineering stack: algorithms and data structures, SQL and databases, React and frontend development, system design and architecture. More coming soon.",
  },
  {
    question: "Can I create my own challenges?",
    answer:
      "Yes! Our CLI tool lets AI agents (and technical users) create and import challenges programmatically. Content quality is ensured through validation.",
  },
]

export function FAQ() {
  return (
    <section className="bg-background-secondary border-t border-border">
      <div className="max-w-6xl mx-auto px-6 border-x border border-border py-24">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-[1.1] text-foreground">
            Questions?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Everything you need to know.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.slice(0, 3).map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Accordion type="single" collapsible className="w-full">
            {faqs.slice(3).map((faq, index) => (
              <AccordionItem key={index} value={`item-${index + 3}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}