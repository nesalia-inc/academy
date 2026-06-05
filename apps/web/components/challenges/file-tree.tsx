"use client"

import { useEffect, useRef } from "react"
import { FileTree, useFileTree, useFileTreeSelection } from "@pierre/trees/react"
import { useChallengeEditorStore } from "@/store/use-challenge-editor-store"

export function FileTreeComponent() {
  const { files, openFile } = useChallengeEditorStore()

  const paths = files.map((file) => file.path)

  const { model } = useFileTree({
    initialExpansion: "open",
    paths,
    search: false,
  })

  // Get selected paths from the tree model
  const selectedPaths = useFileTreeSelection(model)

  const prevSelectedRef = useRef<string | null>(null)
  const filesRef = useRef(files)
  filesRef.current = files

  useEffect(() => {
    // Only process if we have a selection and it actually changed
    if (selectedPaths.length > 0) {
      const currentSelected = selectedPaths[0]
      if (currentSelected !== prevSelectedRef.current) {
        prevSelectedRef.current = currentSelected
        const file = filesRef.current.find((f) => f.path === currentSelected)
        if (file) {
          openFile(file.id)
        }
      }
    }
  }, [selectedPaths, openFile])

  return (
    <FileTree
      model={model}
      header={<span className="text-xs font-medium px-2">Explorer</span>}
      style={{
        height: "100%",
        "--trees-selected-bg-override": "hsl(var(--accent))",
        "--trees-fg-override": "hsl(var(--foreground))",
        "--trees-border-color-override": "hsl(var(--border))",
      } as React.CSSProperties}
    />
  )
}
