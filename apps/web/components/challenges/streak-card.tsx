"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame } from "lucide-react"

const streak = {
  current: 12,
  longest: 21,
  todayCompleted: false,
}

export function StreakCard() {
  return (
    <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Flame className="size-5 text-orange-500" />
          Daily Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-3xl font-bold">{streak.current}</p>
          <p className="text-xs text-muted-foreground">days in a row</p>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Best streak</span>
          <span className="font-medium">{streak.longest} days</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {streak.todayCompleted ? (
            <span className="text-green-500">✓ Completed today</span>
          ) : (
            <span className="text-muted-foreground">○ Not completed today</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}