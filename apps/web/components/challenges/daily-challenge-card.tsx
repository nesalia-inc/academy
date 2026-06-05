"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Clock } from "lucide-react"
import { ColoredBadge } from "@/components/challenges/colored-badge"

const dailyChallenge = {
  title: "Reverse a String in Place",
  difficulty: "Medium",
  category: "Strings",
  timeLeft: "02:34:12",
  participants: 142,
  description:
    "Write a function that reverses a string in-place without using extra memory.",
}

export function DailyChallengeCard() {
  const difficultyColor = dailyChallenge.difficulty === "Easy" ? "green" : dailyChallenge.difficulty === "Medium" ? "orange" : "red"

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <ColoredBadge color="blue" className="gap-1">
            <Target className="size-3" />
            Daily Challenge
          </ColoredBadge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            {dailyChallenge.timeLeft}
          </div>
        </div>
        <CardTitle className="text-xl mt-2">{dailyChallenge.title}</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          {dailyChallenge.description}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <ColoredBadge color={difficultyColor}>{dailyChallenge.difficulty}</ColoredBadge>
          <span className="text-sm text-muted-foreground">
            {dailyChallenge.participants} participants today
          </span>
        </div>
      </CardContent>
    </Card>
  )
}