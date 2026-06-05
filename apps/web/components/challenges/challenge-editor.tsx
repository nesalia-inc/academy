"use client"

import { useEffect, useRef } from "react"
import Editor, { OnMount } from "@monaco-editor/react"
import { useChallengeEditorStore } from "@/store/use-challenge-editor-store"

export function ChallengeEditor() {
  const { files, activeFileId, updateFileContent } = useChallengeEditorStore()
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null)

  const activeFile = files.find((file) => file.id === activeFileId)

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor
  }

  const handleChange = (value: string | undefined) => {
    if (activeFileId && value !== undefined) {
      updateFileContent(activeFileId, value)
    }
  }

  useEffect(() => {
    if (editorRef.current && activeFile) {
      const model = editorRef.current.getModel()
      if (model && model.getValue() !== activeFile.content) {
        editorRef.current.setValue(activeFile.content)
      }
    }
  }, [activeFileId, activeFile?.content])

  if (!activeFile) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>No file selected</p>
      </div>
    )
  }

  return (
    <Editor
      height="100%"
      language={activeFile.language}
      value={activeFile.content}
      onChange={handleChange}
      onMount={handleEditorMount}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        padding: { top: 16, bottom: 16 },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: "on",
        lineNumbers: "on",
        renderLineHighlight: "line",
        scrollbar: {
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        },
      }}
    />
  )
}
