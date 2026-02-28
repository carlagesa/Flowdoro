"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import {
  X,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Quote,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RemoveFormatting,
  GripHorizontal,
} from "lucide-react"
import { useDraggable } from "@/hooks/use-draggable"

interface NotepadProps {
  open: boolean
  onClose: () => void
}

const TOOLBAR_GROUPS = [
  [
    { command: "bold", icon: Bold, label: "Bold" },
    { command: "italic", icon: Italic, label: "Italic" },
    { command: "underline", icon: Underline, label: "Underline" },
    { command: "strikeThrough", icon: Strikethrough, label: "Strikethrough" },
  ],
  [
    { command: "formatBlock:h1", icon: Heading1, label: "Heading 1" },
    { command: "formatBlock:h2", icon: Heading2, label: "Heading 2" },
    { command: "formatBlock:blockquote", icon: Quote, label: "Quote" },
  ],
  [
    { command: "insertUnorderedList", icon: List, label: "Bullet list" },
    { command: "insertOrderedList", icon: ListOrdered, label: "Numbered list" },
  ],
  [
    { command: "justifyLeft", icon: AlignLeft, label: "Align left" },
    { command: "justifyCenter", icon: AlignCenter, label: "Align center" },
    { command: "justifyRight", icon: AlignRight, label: "Align right" },
  ],
  [
    { command: "removeFormat", icon: RemoveFormatting, label: "Clear formatting" },
  ],
]

export function Notepad({ open, onClose }: NotepadProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())

  const { position, containerRef, dragProps } = useDraggable({
    initialPosition: { x: 16, y: Math.max(60, (typeof window !== "undefined" ? window.innerHeight : 600) / 2 - 280) },
    handleSelector: "[data-drag-handle]",
  })

  const updateCounts = useCallback(() => {
    if (!editorRef.current) return
    const text = editorRef.current.innerText || ""
    const trimmed = text.trim()
    setCharCount(trimmed.length)
    setWordCount(trimmed.length === 0 ? 0 : trimmed.split(/\s+/).filter(Boolean).length)
  }, [])

  const checkActiveFormats = useCallback(() => {
    const formats = new Set<string>()
    const commands = ["bold", "italic", "underline", "strikeThrough", "insertUnorderedList", "insertOrderedList", "justifyLeft", "justifyCenter", "justifyRight"]
    commands.forEach((cmd) => {
      if (document.queryCommandState(cmd)) {
        formats.add(cmd)
      }
    })
    setActiveFormats(formats)
  }, [])

  useEffect(() => {
    const handleSelectionChange = () => {
      checkActiveFormats()
    }
    document.addEventListener("selectionchange", handleSelectionChange)
    return () => document.removeEventListener("selectionchange", handleSelectionChange)
  }, [checkActiveFormats])

  const execCommand = useCallback((commandStr: string) => {
    editorRef.current?.focus()
    if (commandStr.startsWith("formatBlock:")) {
      const tag = commandStr.split(":")[1]
      document.execCommand("formatBlock", false, tag)
    } else {
      document.execCommand(commandStr, false)
    }
    checkActiveFormats()
    updateCounts()
  }, [checkActiveFormats, updateCounts])

  const isActive = useCallback((commandStr: string) => {
    if (commandStr.startsWith("formatBlock:")) return false
    return activeFormats.has(commandStr)
  }, [activeFormats])

  if (!open) return null

  return (
    <div
      ref={containerRef}
      className="fixed z-40 animate-in fade-in duration-300"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: "none",
        userSelect: "none",
      }}
      {...dragProps}
    >
      <div className="w-[420px] max-w-[calc(100vw-2rem)] rounded-2xl bg-[rgba(10,5,20,0.88)] backdrop-blur-xl border border-foreground/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
        {/* Drag handle */}
        <div
          data-drag-handle
          className="flex items-center justify-center py-1.5 cursor-grab active:cursor-grabbing select-none"
        >
          <GripHorizontal className="w-5 h-5 text-foreground/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-2 shrink-0">
          <h2 className="text-foreground text-lg font-bold tracking-tight">Notepad</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center text-foreground/50 hover:bg-foreground/15 hover:text-foreground transition-colors"
            aria-label="Close notepad"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Word / char counts */}
        <div className="px-5 pb-2 flex items-center gap-3 text-muted-foreground text-xs shrink-0">
          <span>
            Word count: <span className="text-foreground/70 tabular-nums font-medium">{wordCount}</span>
          </span>
          <span className="text-foreground/20">|</span>
          <span>
            Character count: <span className="text-foreground/70 tabular-nums font-medium">{charCount}</span>
          </span>
        </div>

        {/* Toolbar */}
        <div className="px-4 pb-2 shrink-0">
          <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 rounded-lg bg-foreground/5 border border-foreground/5">
            {TOOLBAR_GROUPS.map((group, gi) => (
              <div key={gi} className="flex items-center">
                {gi > 0 && (
                  <div className="w-px h-5 bg-foreground/10 mx-1.5" />
                )}
                {group.map((btn) => {
                  const Icon = btn.icon
                  const active = isActive(btn.command)
                  return (
                    <button
                      key={btn.command}
                      onClick={() => execCommand(btn.command)}
                      className={`w-7 h-7 flex items-center justify-center rounded-md transition-all duration-150 ${
                        active
                          ? "bg-primary/25 text-primary"
                          : "text-foreground/45 hover:text-foreground/80 hover:bg-foreground/10"
                      }`}
                      aria-label={btn.label}
                      aria-pressed={active}
                      title={btn.label}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="px-4 pb-4 flex-1 min-h-0">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={updateCounts}
            onKeyUp={checkActiveFormats}
            onMouseUp={checkActiveFormats}
            data-placeholder="Brain dump your best ideas without distractions..."
            className="notepad-editor h-full min-h-[200px] max-h-[45vh] overflow-y-auto rounded-xl bg-foreground/[0.03] border border-foreground/5 px-4 py-3 text-foreground/90 text-sm leading-relaxed outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-colors"
            role="textbox"
            aria-multiline="true"
            aria-label="Notepad editor"
          />
        </div>
      </div>
    </div>
  )
}
