"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ColoredBadge } from "@/components/challenges/colored-badge"
import { cn } from "@/lib/utils"

const categories = [
  {
    name: "Arrays",
    slug: "arrays",
    count: 24,
    color: "blue" as const,
    description: "Arrays are fundamental data structures. Learn to manipulate, search, sort, and optimize array operations for better performance in coding challenges.",
  },
  {
    name: "Strings",
    slug: "strings",
    count: 18,
    color: "green" as const,
    description: "Master text processing techniques including pattern matching, string manipulation, and efficient algorithms for solving complex string problems.",
  },
  {
    name: "Linked Lists",
    slug: "linked-lists",
    count: 12,
    color: "purple" as const,
    description: "Understand node-based data structures, pointer manipulation, and learn to solve problems involving list traversal, reversal, and merging.",
  },
  {
    name: "Trees",
    slug: "trees",
    count: 15,
    color: "orange" as const,
    description: "Explore hierarchical data structures including binary trees, BSTs, and graphs. Learn traversals, path finding, and tree manipulation techniques.",
  },
]

export function CategoryCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/challenges/categories/${cat.slug}`}
          className="block"
        >
          <Card className="h-full cursor-pointer hover:border-primary/50 transition-colors py-3 [&>div]:!px-3">
            <CardContent className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <ColoredBadge color={cat.color}>{cat.name}</ColoredBadge>
                <span className="text-xs text-muted-foreground">
                  {cat.count}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-3">
                {cat.description}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
