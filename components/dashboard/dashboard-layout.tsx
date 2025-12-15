"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { LibraryView } from "@/components/dashboard/library-view"
import { PlannerView } from "@/components/dashboard/planner-view"
import { StatsView } from "@/components/dashboard/stats-view"
import { SocialView } from "@/components/dashboard/social-view"
import { ProfileView } from "@/components/dashboard/profile-view"

export function DashboardLayout() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("library")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("bookmedia_user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">BookMedia</h1>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-semibold">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6">
        {activeTab === "library" && <LibraryView />}
        {activeTab === "planner" && <PlannerView />}
        {activeTab === "stats" && <StatsView />}
        {activeTab === "social" && <SocialView />}
        {activeTab === "profile" && <ProfileView />}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
