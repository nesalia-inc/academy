"use client"

import { useEffect, useRef } from "react"
import {
  FileTree,
  useFileTree,
  useFileTreeSelection,
  type FileTreeItem,
} from "@pierre/trees/react"
import { useChallengeEditorStore } from "@/store/use-challenge-editor-store"
import { Plus, FolderPlus } from "lucide-react"

export function FileTreeComponent() {
  const { files, openFile, addFile } = useChallengeEditorStore()

  const paths = files.map((file) => file.path)

  const { model } = useFileTree({
    initialExpansion: "open",
    paths,
    search: false,
    composition: {
      contextMenu: {
        enabled: true,
        triggerMode: "right-click",
        buttonVisibility: "never",
      },
    },
    renaming: {
      onRename: ({ sourcePath, destinationPath }) => {
        // Update file path and name in the store after rename
        useChallengeEditorStore.setState((state) => ({
          files: state.files.map((file) =>
            file.path === sourcePath
              ? {
                  ...file,
                  path: destinationPath,
                  name: destinationPath.split("/").pop() ?? file.name,
                }
              : file
          ),
        }))
      },
    },
  })

  const handleNewFile = () => {
    const id = `file-${Date.now()}`
    const name = "untitled.ts"
    const path = `/src/${name}`
    const newFile = {
      id,
      name,
      path,
      content: "",
      language: "typescript",
    }
    model.add(path)
    addFile(newFile)
    model.startRenaming(path)
  }

  const handleDelete = (path: string) => {
    const file = files.find((f) => f.path === path)
    if (!file) return
    model.remove(path)
    useChallengeEditorStore.setState((state) => ({
      files: state.files.filter((f) => f.id !== file.id),
      openFileIds: state.openFileIds.filter((id) => id !== file.id),
      activeFileId:
        state.activeFileId === file.id
          ? state.openFileIds.find((id) => id !== file.id) ?? null
          : state.activeFileId,
    }))
  }

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
              onClick={handleNewFile}
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
      renderContextMenu={(item: FileTreeItem, context) => (
        <div className="rounded-md border bg-background p-1 shadow-md min-w-[120px]">
          <button
            onClick={() => {
              context.close({ restoreFocus: false })
              model.startRenaming(item.path)
            }}
            className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors"
          >
            Rename
          </button>
          <button
            onClick={() => {
              context.close()
              handleDelete(item.path)
            }}
            className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors text-destructive"
          >
            Delete
          </button>
        </div>
      )}
    />
  )
}
