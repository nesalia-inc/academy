"use client"

import { cn } from "@/lib/utils"

type Color = "green" | "orange" | "blue" | "purple" | "red" | "yellow" | "pink" | "indigo" | "gray"

type ColoredBadgeProps = {
  color: Color
  children: React.ReactNode
  className?: string
}

const colorClasses: Record<Color, { bg: string; border: string; text: string }> = {
  green: {
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    text: "text-green-500",
  },
  orange: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    text: "text-orange-500",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-500",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-500",
  },
  red: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-500",
  },
  yellow: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    text: "text-yellow-500",
  },
  pink: {
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    text: "text-pink-500",
  },
  indigo: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    text: "text-indigo-500",
  },
  gray: {
    bg: "bg-muted",
    border: "border-muted",
    text: "text-muted-foreground",
  },
}

export function ColoredBadge({ color, children, className }: ColoredBadgeProps) {
  const { bg, border, text } = colorClasses[color]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        bg,
        border,
        text,
        className
      )}
    >
      {children}
    </span>
  )
}
