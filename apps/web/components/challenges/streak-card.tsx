"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"

const streak = {
  current: 12,
  longest: 21,
  todayCompleted: false,
}

// Generate last 28 days of data
const getLast28Days = () => {
  const days = []
  const today = new Date()
  const completedDays = new Set([7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]) // Example completed days

  for (let i = 27; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dayNum = date.getDate()
    days.push({
      date: date,
      dayNum,
      completed: completedDays.has(dayNum),
      isToday: dayNum === today.getDate(),
    })
  }
  return days
}

export function StreakCard() {
  const days = getLast28Days()

  // Group by weeks (7 days per row)
  const weeks: typeof days[] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Flame className="size-5 text-orange-500" />
            Streak
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {streak.current} days
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Calendar Grid */}
        <div className="space-y-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={cn(
                    "size-6 rounded-sm transition-colors",
                    day.completed
                      ? "bg-orange-500"
                      : day.isToday
                        ? "bg-orange-500/30 border border-orange-500/50"
                        : "bg-muted"
                  )}
                  title={`${day.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} ${day.completed ? "✓" : "○"}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="size-3 rounded-sm bg-muted" />
            <span>Missed</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="size-3 rounded-sm bg-orange-500" />
            <span>Done</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs">
          <span className="text-muted-foreground">Best: {streak.longest} days</span>
          {streak.todayCompleted ? (
            <span className="text-green-500 font-medium">Today ✓</span>
          ) : (
            <span className="text-muted-foreground">Not done yet</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}