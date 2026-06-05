"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ColoredBadge } from "@/components/challenges/colored-badge"
import { ChallengeEditorPanel } from "@/components/challenges/challenge-editor-panel"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { useState } from "react"

const challengeTabs = [
  { href: "description", label: "Description" },
  { href: "solution", label: "Solution" },
  { href: "submissions", label: "Submissions" },
]

export default function ChallengeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [liked, setLiked] = useState<"up" | "down" | null>(null)

  return (
    <div className="flex h-[calc(100vh-3.5rem)] min-h-0">
      <div className="flex flex-col h-full flex-1 min-w-0 min-h-0">
        <div className="flex-1 overflow-hidden">
          <div className="p-1 h-full">
            <ResizablePanelGroup className="gap-0.5">
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="flex flex-col h-full border rounded-md">
                  {/* Tabs */}
                  <div className="flex items-center justify-stretch w-full px-4 py-2 border-b shrink-0 gap-2">
                    {challengeTabs.map((tab) => {
                      const isActive = pathname.endsWith(`/${tab.href}`)
                      return (
                        <Link
                          key={tab.href}
                          href={`/challenges/two-sum/${tab.href}`}
                          className={`flex-1 text-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          {tab.label}
                        </Link>
                      )
                    })}
                  </div>

                  {/* Challenge Info Header */}
                  <div className="flex flex-col gap-2 px-4 py-3 border-b shrink-0">
                    <div className="flex items-center gap-3">
                      <h1 className="text-lg font-bold">Two Sum</h1>
                      <ColoredBadge color="green">Easy</ColoredBadge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Topics:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <ColoredBadge color="blue">Array</ColoredBadge>
                        <ColoredBadge color="blue">Hash Table</ColoredBadge>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-auto p-6">
                    {children}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between px-4 py-3 border-t shrink-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setLiked(liked === "up" ? null : "up")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                          liked === "up"
                            ? "bg-green-500/10 text-green-500"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <ThumbsUp className="size-4" />
                        <span className="text-sm font-medium">Like</span>
                      </button>
                      <button
                        onClick={() => setLiked(liked === "down" ? null : "down")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                          liked === "down"
                            ? "bg-red-500/10 text-red-500"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <ThumbsDown className="size-4" />
                        <span className="text-sm font-medium">Dislike</span>
                      </button>
                    </div>
                    <Link
                      href="/challenges/two-sum/rate"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Rate this challenge
                    </Link>
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle className="w-1 bg-transparent hover:bg-border rounded-md transition-all duration-200" />

              <ResizablePanel defaultSize={50} minSize={40}>
                <ChallengeEditorPanel />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </div>
    </div>
  )
}
