"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { ColoredBadge } from "@/components/challenges/colored-badge"

const profile = {
  name: "Alex Chen",
  email: "alex@example.com",
  level: 8,
  currentXp: 650,
  xpToNextLevel: 1000,
  challengesCompleted: 47,
  rank: "Intermediate",
  joinedDate: "Jan 2025",
}

export function ProfileCard() {
  const { setTheme } = useTheme()
  const xpProgress = (profile.currentXp / profile.xpToNextLevel) * 100

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="size-12 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                <AvatarFallback>
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
                {profile.email && (
                  <AvatarImage
                    src={`https://vercel.com/api/www/avatar?s=48&u=${encodeURIComponent(profile.email)}&dpl=dpl_G61Gj1bEoqhEUhb3w2t9wubjKqeY`}
                    alt={profile.name}
                  />
                )}
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="size-4 mr-2" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="size-4 mr-2" />
                Dark
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-medium truncate">{profile.name}</p>
              <ColoredBadge color="purple">Lvl {profile.level}</ColoredBadge>
            </div>
            <p className="text-xs text-muted-foreground">{profile.rank}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* XP Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">XP Progress</span>
            <span className="font-medium text-primary">
              {profile.currentXp} / {profile.xpToNextLevel}
            </span>
          </div>
          <div className="relative">
            <Progress value={xpProgress} className="h-2 [&>div]:bg-primary" />
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Challenges</span>
            <span className="font-medium">{profile.challengesCompleted}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Joined</span>
            <span className="font-medium">{profile.joinedDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}