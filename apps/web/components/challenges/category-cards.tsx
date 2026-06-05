"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const categories = [
  { name: "Arrays", count: 24, color: "bg-blue-500" },
  { name: "Strings", count: 18, color: "bg-green-500" },
  { name: "Linked Lists", count: 12, color: "bg-purple-500" },
  { name: "Trees", count: 15, color: "bg-orange-500" },
]

export function CategoryCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {categories.map((cat) => (
        <Card
          key={cat.name}
          className="cursor-pointer hover:border-primary/50 transition-colors"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`size-3 rounded-full ${cat.color}`} />
              <div>
                <p className="font-medium text-sm">{cat.name}</p>
                <p className="text-xs text-muted-foreground">{cat.count} challenges</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}