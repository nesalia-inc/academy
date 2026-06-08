"use client"

import { useEffect, useRef } from "react"
import { FileTree, useFileTree, useFileTreeSelection } from "@pierre/trees/react"
import { useChallengeEditorStore } from "@/store/use-challenge-editor-store"
import { Plus, FolderPlus } from "lucide-react"

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
      className="bg-background"
      header={
        <div className="flex items-center justify-between h-8 px-2 border-b">
          <span className="text-sm font-medium text-muted-foreground">Explorer</span>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => {}}
              className="p-1 rounded hover:bg-muted transition-colors"
              title="New File"
            >
              <Plus className="size-3.5 text-muted-foreground" />
            </button>
            <button
              onClick={() => {}}
              className="p-1 rounded hover:bg-muted transition-colors"
              title="New Folder"
            >
              <FolderPlus className="size-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>
      }
      style={{
        height: "100%",
        "--trees-bg-override": "hsl(var(--background))",
        "--trees-selected-bg-override": "hsl(var(--accent))",
        "--trees-fg-override": "hsl(var(--foreground))",
        "--trees-border-color-override": "hsl(var(--border))",
      } as React.CSSProperties}
    />
  )
}
