"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { LibraryView } from "@/components/dashboard/library-view"
import { PlannerView } from "@/components/dashboard/planner-view"
import { StatsView } from "@/components/dashboard/stats-view"
import { SocialView } from "@/components/dashboard/social-view"
import { ProfileView } from "@/components/dashboard/profile-view"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { User, Settings, LogOut } from "lucide-react"

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <Avatar className="w-10 h-10">
                  {user.profilePhoto ? (
                    <AvatarImage src={user.profilePhoto} alt={user.name} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-semibold">
                      {user.name?.[0]?.toUpperCase() || user.firstName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <Card className="border-0 shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-12 h-12">
                      {user.profilePhoto ? (
                        <AvatarImage src={user.profilePhoto} alt={user.name} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-semibold">
                          {user.name?.[0]?.toUpperCase() || user.firstName?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim()}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      {user.username && (
                        <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveTab("profile")}>
                <User className="w-4 h-4 mr-2" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                localStorage.removeItem("bookmedia_user")
                router.push("/")
              }}>
                <LogOut className="w-4 h-4 mr-2" />
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
