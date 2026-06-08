import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative bg-background overflow-hidden">
      {/* Tech logos as decorative background */}
      {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-8 left-[15%]">
          <div className="border border-border bg-background p-3 opacity-60">
            <Image src="/typescript.png" alt="TypeScript" width={32} height={32} className="w-8 h-8 object-contain" />
          </div>
        </div>
        <div className="absolute top-12 left-1/2 -translate-x-1/2">
          <div className="border border-border bg-background p-3 opacity-60">
            <Image src="/python.png" alt="Python" width={32} height={32} className="w-8 h-8 object-contain" />
          </div>
        </div>
        <div className="absolute top-8 right-[15%]">
          <div className="border border-border bg-background p-3 opacity-60">
            <Image src="/go.png" alt="Go" width={32} height={32} className="w-8 h-8 object-contain" />
          </div>
        </div>

        <div className="absolute top-1/3 left-8">
          <div className="border border-border bg-background p-3 opacity-55">
            <Image src="/typescript.png" alt="TypeScript" width={40} height={40} className="w-10 h-10 object-contain" />
          </div>
        </div>
        <div className="absolute bottom-1/3 left-8">
          <div className="border border-border bg-background p-3 opacity-55">
            <Image src="/python.png" alt="Python" width={40} height={40} className="w-10 h-10 object-contain" />
          </div>
        </div>

        <div className="absolute top-1/3 right-8">
          <div className="border border-border bg-background p-3 opacity-55">
            <Image src="/go.png" alt="Go" width={40} height={40} className="w-10 h-10 object-contain" />
          </div>
        </div>
        <div className="absolute bottom-1/3 right-8">
          <div className="border border-border bg-background p-3 opacity-55">
            <Image src="/typescript.png" alt="TypeScript" width={40} height={40} className="w-10 h-10 object-contain" />
          </div>
        </div>

        <div className="absolute bottom-12 left-[25%]">
          <div className="border border-border bg-background p-3 opacity-60">
            <Image src="/go.png" alt="Go" width={32} height={32} className="w-8 h-8 object-contain" />
          </div>
        </div>
        <div className="absolute bottom-12 right-[25%]">
          <div className="border border-border bg-background p-3 opacity-60">
            <Image src="/python.png" alt="Python" width={32} height={32} className="w-8 h-8 object-contain" />
          </div>
        </div>
      </div> */}

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16 border-x border-t border-border mt-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors cursor-pointer">
              Free parcours available
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[0.95] text-foreground">
            From learning to mastering.
            <br />
            <span className="text-muted-foreground">
              The software engineering path.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Learn software engineering the right way. Start with free parcours.
            Go all the way to mastery.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/challenges"
              className="inline-flex items-center justify-center gap-2.5 bg-primary hover:bg-primary/90 rounded-none px-6 py-3.5 text-sm font-medium text-primary-foreground transition-colors"
            >
              Start a free parcours
            </Link>
            <Link
              href="#mastery"
              className="inline-flex items-center justify-center gap-2.5 border border-border hover:border-accent bg-card hover:bg-secondary rounded-none px-6 py-3.5 text-sm font-medium text-muted-foreground transition-colors"
            >
              Explore mastery paths
            </Link>
          </div>
        </div>

        {/* App Preview Image */}
        <div className="mt-16 max-w-3xl mx-auto border border-border overflow-hidden">
          <Image
            src="/home.png"
            alt="Academy app preview"
            width={1000}
            height={560}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
    </section>
  )
}