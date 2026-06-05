"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const profile = {
  name: "Alex Chen",
  email: "alex@example.com",
  challengesCompleted: 47,
  rank: "Intermediate",
  joinedDate: "Jan 2025",
}

export function ProfileCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarFallback>
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
            <AvatarImage
              src={`https://vercel.com/api/www/avatar?s=48&u=${encodeURIComponent(profile.email)}&dpl=dpl_G61Gj1bEoqhEUhb3w2t9wubjKqeY`}
              alt={profile.name}
            />
          </Avatar>
          <div>
            <p className="font-medium">{profile.name}</p>
            <p className="text-xs text-muted-foreground">{profile.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Challenges</span>
          <span className="font-medium">{profile.challengesCompleted}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Rank</span>
          <span className="font-medium">{profile.rank}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Joined</span>
          <span className="font-medium">{profile.joinedDate}</span>
        </div>
      </CardContent>
    </Card>
  )
}