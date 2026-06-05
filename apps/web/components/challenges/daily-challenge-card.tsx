"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Clock } from "lucide-react"

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
  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="gap-1">
            <Target className="size-3" />
            Daily Challenge
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            {dailyChallenge.timeLeft}
          </div>
        </div>
        <CardTitle className="text-xl mt-2">{dailyChallenge.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Badge variant="outline">{dailyChallenge.difficulty}</Badge>
          <span className="text-sm text-muted-foreground">
            {dailyChallenge.participants} participants today
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          {dailyChallenge.description}
        </p>
      </CardContent>
    </Card>
  )
}