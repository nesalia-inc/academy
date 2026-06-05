"use client"

import Link from "next/link"
import { Eclipse } from "lucide-react"
import { AuthButtons } from "@/components/auth/auth-buttons"

export function AppHeader() {
  return (
    <header className="border-b h-14">
      <div className="flex items-center justify-between h-full px-6">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <img
            src="/transparent-icon.svg"
            alt="Nesalia Inc. logo"
            className="size-8"
          />
        </Link>
        <AuthButtons />
      </div>
    </header>
  )
}