import { DailyChallengeCard } from "@/components/challenges/daily-challenge-card"
import { CategoryCards } from "@/components/challenges/category-cards"
import { ChallengeTable } from "@/components/challenges/challenge-table"
import { ProfileCard } from "@/components/challenges/profile-card"
import { StreakCard } from "@/components/challenges/streak-card"

export default function DashboardHomePage() {
  return (
    <div className="max-w-5xl mx-auto py-12 grid grid-cols-1 lg:grid-cols-7 gap-6">
      {/* Main content - 70% */}
      <div className="lg:col-span-5 space-y-6">
        <DailyChallengeCard />
        <CategoryCards />
        <ChallengeTable />
      </div>

      {/* Side content - 30% */}
      <div className="lg:col-span-2 space-y-6">
        <ProfileCard />
        <StreakCard />
      </div>
    </div>
  )
}