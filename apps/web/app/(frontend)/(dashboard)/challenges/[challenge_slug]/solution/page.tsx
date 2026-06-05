"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, HardDrive } from "lucide-react"

const solutions = [
  {
    id: "1",
    language: "TypeScript",
    author: "alexchen",
    runtime: "52 ms",
    memory: "44.9 MB",
    votes: 1240,
    code: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }

  return [];
}`,
  },
  {
    id: "2",
    language: "Python",
    author: "codingguru",
    runtime: "48 ms",
    memory: "42.1 MB",
    votes: 892,
    code: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []`,
  },
]

export default function SolutionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Top Solutions</h2>
        <Badge variant="secondary">{solutions.length} solutions</Badge>
      </div>

      <div className="space-y-4">
        {solutions.map((solution) => (
          <Card key={solution.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium">
                    {solution.language}
                  </span>
                  <span className="text-sm text-muted-foreground">by {solution.author}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="size-3" />
                    {solution.votes} votes
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {solution.runtime}
                  </span>
                  <span className="flex items-center gap-1">
                    <HardDrive className="size-3" />
                    {solution.memory}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                <code>{solution.code}</code>
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
