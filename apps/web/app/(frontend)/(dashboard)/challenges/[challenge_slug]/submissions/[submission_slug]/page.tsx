"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, HardDrive, ChevronLeft } from "lucide-react"

export default function SubmissionDetailPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/challenges/two-sum/submissions"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Back to submissions
        </Link>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="size-6 text-green-500" />
              <div>
                <h1 className="text-xl font-semibold">Accepted</h1>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
              Accepted
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-muted rounded-md">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Clock className="size-4" />
                Runtime
              </div>
              <p className="text-lg font-semibold">52 ms</p>
              <p className="text-xs text-muted-foreground">faster than 95.23%</p>
            </div>
            <div className="p-4 bg-muted rounded-md">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <HardDrive className="size-4" />
                Memory
              </div>
              <p className="text-lg font-semibold">44.9 MB</p>
              <p className="text-xs text-muted-foreground">less than 78.12%</p>
            </div>
            <div className="p-4 bg-muted rounded-md">
              <div className="text-sm text-muted-foreground mb-1">Language</div>
              <p className="text-lg font-semibold">TypeScript</p>
              <p className="text-xs text-muted-foreground">TypeScript 5.x</p>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-medium mb-3">Code</h2>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
              <code>{`function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }

  return [];
}`}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
