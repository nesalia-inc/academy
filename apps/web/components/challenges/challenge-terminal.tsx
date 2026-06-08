"use client"

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react"
import { Terminal } from "@xterm/xterm"
import { FitAddon } from "@xterm/addon-fit"
import { Terminal as TerminalIcon, RotateCcw } from "lucide-react"
import { useChallengeEditorStore } from "@/store/use-challenge-editor-store"

import "@xterm/xterm/css/xterm.css"

export interface ChallengeTerminalRef {
  write: (text: string) => void
  clear: () => void
  runMock: () => void
}

export const ChallengeTerminal = forwardRef<ChallengeTerminalRef>((_, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<Terminal | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const { activeFileId, files } = useChallengeEditorStore()

  useImperativeHandle(ref, () => ({
    write: (text: string) => {
      terminalRef.current?.write(text)
    },
    clear: () => {
      terminalRef.current?.clear()
    },
    runMock: () => {
      const term = terminalRef.current
      if (!term) return

      const activeFile = files.find((f) => f.id === activeFileId)
      const fileName = activeFile?.name || "solution.ts"

      term.clear()
      term.writeln("\x1b[36m$\x1b[0m Running tests...")
      term.writeln("")

      setTimeout(() => {
        term.write(`\x1b[90mTest1:\x1b[0m twoSum([2, 7, 11, 15], 9) => [0, 1] `)
        term.writeln("\x1b[32m✓ PASSED\x1b[0m")

        term.write(`\x1b[90mTest 2:\x1b[0m twoSum([3, 2, 4], 6) => [1, 2] `)
        term.writeln("\x1b[32m✓ PASSED\x1b[0m")

        term.write(`\x1b[90mTest 3:\x1b[0m twoSum([3, 3], 6) => [0, 1] `)
        term.writeln("\x1b[32m✓ PASSED\x1b[0m")

        term.writeln("")
        term.writeln("\x1b[32m✓ All tests passed!\x1b[0m")
        term.writeln(`\x1b[90mExecution time: ${(Math.random() * 2 + 0.5).toFixed(2)}ms\x1b[0m`)
        term.writeln(`\x1b[90mMemory: ${(Math.random() * 5 + 40).toFixed(1)}MB\x1b[0m`)
        term.writeln("")
        term.write(`\x1b[36m$\x1b[0m `)
      }, 800)
    },
  }))

  useEffect(() => {
    if (!containerRef.current) return

    const term = new Terminal({
      theme: {
        background: "#0c0c0c",
        foreground: "#f0f0f0",
        cursor: "#f0f0f0",
        cursorAccent: "#0c0c0c",
        selectionBackground: "#264f78",
        black: "#0c0c0c",
        red: "#c50f1f",
        green: "#13a10e",
        yellow: "#c19c11",
        blue: "#0037da",
        magenta: "#881798",
        cyan: "#3aa9f4",
        white: "#f0f0f0",
        brightBlack: "#767676",
        brightRed: "#e74856",
        brightGreen: "#16c60c",
        brightYellow: "#f9f1a5",
        brightBlue: "#3b78ff",
        brightMagenta: "#b4009e",
        brightCyan: "#61d6d6",
        brightWhite: "#ffffff",
      },
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      fontSize: 13,
      lineHeight: 1.4,
      cursorBlink: true,
      cursorStyle: "bar",
      scrollback: 1000,
 convertEol: true,
    })

    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    term.open(containerRef.current)
    fitAddon.fit()

    terminalRef.current = term
    fitAddonRef.current = fitAddon

    term.writeln("\x1b[90mTerminal ready\x1b[0m")
    term.writeln("\x1b[90mRun your code to see output here\x1b[0m")
    term.writeln("")
    term.write("\x1b[36m$\x1b[0m ")

    const handleResize = () => {
      fitAddon.fit()
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      term.dispose()
      terminalRef.current = null
      fitAddonRef.current = null
    }
  }, [])

  return (
    <div className="flex flex-col h-full bg-[#0c0c0c]">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#2a2a2a] shrink-0 bg-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <TerminalIcon className="size-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Terminal</span>
        </div>
        <button
          onClick={() => {
            terminalRef.current?.clear()
            terminalRef.current?.write("\x1b[36m$\x1b[0m ")
          }}
          className="p-1 rounded hover:bg-[#2a2a2a] transition-colors"
          title="Clear terminal"
        >
          <RotateCcw className="size-3 text-muted-foreground" />
        </button>
      </div>

      {/* Terminal Content */}
      <div ref={containerRef} className="flex-1 overflow-hidden p-2" />
    </div>
  )
})

ChallengeTerminal.displayName = "ChallengeTerminal"
