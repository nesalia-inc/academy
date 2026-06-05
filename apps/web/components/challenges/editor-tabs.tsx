"use client"

import { X } from "lucide-react"
import { useChallengeEditorStore } from "@/store/use-challenge-editor-store"

export function EditorTabs() {
  const { files, openFileIds, activeFileId, setActiveFile, closeFile } =
    useChallengeEditorStore()

  const openFiles = files.filter((file) => openFileIds.includes(file.id))

  if (openFiles.length === 0) {
    return (
      <div className="flex items-center h-9 px-3 border-b bg-muted/50 text-xs text-muted-foreground">
        No files open
      </div>
    )
  }

  return (
    <div className="flex items-center border-b bg-muted/50 overflow-x-auto">
      {openFiles.map((file) => (
        <div
          key={file.id}
          className={`group flex items-center gap-2 px-3 h-9 text-sm cursor-pointer hover:bg-muted transition-colors ${
            activeFileId === file.id ? "bg-background border-t-2 border-t-primary" : ""
          }`}
          onClick={() => setActiveFile(file.id)}
        >
          <span className="truncate max-w-[140px]" title={file.path}>
            {file.name}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              closeFile(file.id)
            }}
            className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-muted-foreground/20 transition-opacity"
          >
            <X className="size-3" />
          </button>
        </div>
      ))}
    </div>
  )
}
