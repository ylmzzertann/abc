"use client"

import { BookOpen, Calendar, BarChart3, Users, User } from "lucide-react"

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "library", label: "Kütüphane", icon: BookOpen },
    { id: "planner", label: "Planlayıcı", icon: Calendar },
    { id: "stats", label: "İstatistik", icon: BarChart3 },
    { id: "social", label: "Sosyal", icon: Users },
    { id: "profile", label: "Profil", icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4">
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 min-w-[60px] transition-colors ${
                  isActive ? "text-amber-600" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
