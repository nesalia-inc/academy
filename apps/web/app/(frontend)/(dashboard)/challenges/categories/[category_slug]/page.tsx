"use client"

import { use } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ColoredBadge } from "@/components/challenges/colored-badge"
import { ChallengeTable } from "@/components/challenges/challenge-table"
import { BookOpen, Target, TrendingUp } from "lucide-react"

const categoryData: Record<
  string,
  {
    name: string
    description: string
    color: "blue" | "green" | "purple" | "orange"
    challenges: number
    completed: number
    tips: string[]
  }
> = {
  arrays: {
    name: "Arrays",
    description:
      "Arrays are one of the most fundamental data structures in programming. They store elements in contiguous memory locations, allowing for fast access by index.",
    color: "blue",
    challenges: 24,
    completed: 12,
    tips: [
      "Use two-pointer technique for O(n) solutions",
      "Hash maps can reduce O(n²) to O(n)",
      "Sorting can simplify many array problems",
      "Consider sliding window for subarray problems",
    ],
  },
  strings: {
    name: "Strings",
    description:
      "Strings are sequences of characters. String manipulation problems often involve pattern matching, parsing, and transformation techniques.",
    color: "green",
    challenges: 18,
    completed: 8,
    tips: [
      "Two-pointer works well for palindrome checks",
      "Use StringBuilder for efficient concatenation",
      "Regex can simplify pattern matching",
      "Consider rolling hash for substring problems",
    ],
  },
  "linked-lists": {
    name: "Linked Lists",
    description:
      "Linked lists are linear data structures where elements are stored in nodes. Each node points to the next node, enabling efficient insertion and deletion.",
    color: "purple",
    challenges: 12,
    completed: 5,
    tips: [
      "Always check for null pointers",
      "Use dummy nodes to simplify edge cases",
      "Floyd's cycle detection for circular lists",
      "Reverse pointers iteratively for reversal",
    ],
  },
  trees: {
    name: "Trees",
    description:
      "Trees are hierarchical data structures with nodes connected by edges. Binary trees, BSTs, and tries are common variants in coding challenges.",
    color: "orange",
    challenges: 15,
    completed: 7,
    tips: [
      "Recursive solutions often use DFS",
      "BFS is useful for level-order traversal",
      "Store parent pointers for some problems",
      "Practice Morris traversal for O(1) space",
    ],
  },
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category_slug: string }>
}) {
  const { category_slug } = use(params)
  const category = categoryData[category_slug]

  if (!category) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Category not found</p>
      </div>
    )
  }

  const progressPercent = Math.round((category.completed / category.challenges) * 100)

  return (
    <div className="max-w-5xl mx-auto py-12 grid grid-cols-1 lg:grid-cols-10 gap-6">
      {/* Left Column - Single Category Card */}
      <div className="lg:col-span-3">
        <Card className="h-full">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="size-5 text-muted-foreground" />
                <CardTitle>{category.name}</CardTitle>
              </div>
              <ColoredBadge color={category.color}>{category.name}</ColoredBadge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Description */}
            <p className="text-sm text-muted-foreground">{category.description}</p>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Progress</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium">
                  {category.completed} / {category.challenges}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right">
                {progressPercent}% complete
              </p>
            </div>

            {/* Tips */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Tips</span>
              </div>
              <ul className="space-y-1.5">
                {category.tips.map((tip, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Challenge Table */}
      <div className="lg:col-span-7">
        <ChallengeTable />
      </div>
    </div>
  )
}
