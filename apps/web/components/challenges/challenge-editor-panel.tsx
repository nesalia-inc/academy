"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { PanelLeft, PanelLeftClose, Play, Terminal as TerminalIcon } from "lucide-react"
import { FileTreeComponent } from "@/components/challenges/file-tree"
import { EditorTabs } from "@/components/challenges/editor-tabs"
import { ChallengeEditor } from "@/components/challenges/challenge-editor"
import { ChallengeTerminal, type ChallengeTerminalRef } from "@/components/challenges/challenge-terminal"

export function ChallengeEditorPanel() {
  const [isTreeOpen, setIsTreeOpen] = useState(true)
  const [isTerminalOpen, setIsTerminalOpen] = useState(true)
  const terminalRef = useRef<ChallengeTerminalRef>(null)

  const handleRun = () => {
    if (!isTerminalOpen) {
      setIsTerminalOpen(true)
    }
    terminalRef.current?.runMock()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTreeOpen(!isTreeOpen)}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            title={isTreeOpen ? "Close explorer" : "Open explorer"}
          >
            {isTreeOpen ? (
              <PanelLeftClose className="size-4 text-muted-foreground" />
            ) : (
              <PanelLeft className="size-4 text-muted-foreground" />
            )}
          </button>
          <span className="text-sm font-medium">Explorer</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setIsTerminalOpen(!isTerminalOpen)}
            className={`p-1.5 rounded-md transition-colors ${
              isTerminalOpen
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            title={isTerminalOpen ? "Hide terminal" : "Show terminal"}
          >
            <TerminalIcon className="size-4" />
          </button>
          <button
            onClick={handleRun}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs font-medium transition-colors"
          >
            <Play className="size-3" />
            Run
          </button>
          <Link
            href={`/challenges/two-sum/submissions/new`}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:opacity-90"
          >
            Submit
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden flex-col">
        {/* Main Editor Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* File Tree Sidebar */}
          {isTreeOpen && (
            <div className="w-56 border-r shrink-0 overflow-auto">
              <FileTreeComponent />
            </div>
          )}

          {/* Editor Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-background">
            <EditorTabs />
            <div className="flex-1 overflow-hidden">
              <ChallengeEditor />
            </div>
          </div>
        </div>

        {/* Terminal Panel */}
        {isTerminalOpen && (
          <div className="h-48 border-t shrink-0">
            <ChallengeTerminal ref={terminalRef} />
          </div>
        )}
      </div>
    </div>
  )
}
