"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, Target, TrendingUp, Plus, Check } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ReadingSession {
  id: string
  date: string
  minutes: number
  pages: number
  bookTitle: string
}

export function PlannerView() {
  const [dailyGoal, setDailyGoal] = useState(30)
  const [todayMinutes, setTodayMinutes] = useState(0)
  const [weekStreak, setWeekStreak] = useState(3)
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false)
  const [sessions, setSessions] = useState<ReadingSession[]>([])
  const [sessionForm, setSessionForm] = useState({
    minutes: "",
    pages: "",
    bookTitle: "",
  })

  useEffect(() => {
    // Load user preferences
    const userData = localStorage.getItem("bookmedia_user")
    if (userData) {
      const user = JSON.parse(userData)
      if (user.preferences?.dailyGoal) {
        setDailyGoal(user.preferences.dailyGoal)
      }
    }

    // Load today's sessions
    const savedSessions = localStorage.getItem("reading_sessions")
    if (savedSessions) {
      const allSessions = JSON.parse(savedSessions)
      const today = new Date().toISOString().split("T")[0]
      const todaySessions = allSessions.filter((s: ReadingSession) => s.date === today)
      setSessions(todaySessions)
      setTodayMinutes(todaySessions.reduce((sum: number, s: ReadingSession) => sum + s.minutes, 0))
    }
  }, [])

  const progressPercentage = Math.min((todayMinutes / dailyGoal) * 100, 100)
  const isGoalComplete = todayMinutes >= dailyGoal

  const handleAddSession = () => {
    if (!sessionForm.minutes || !sessionForm.bookTitle) return

    const newSession: ReadingSession = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      minutes: Number.parseInt(sessionForm.minutes),
      pages: Number.parseInt(sessionForm.pages) || 0,
      bookTitle: sessionForm.bookTitle,
    }

    const allSessions = [...sessions, newSession]
    setSessions(allSessions)
    setTodayMinutes(todayMinutes + newSession.minutes)

    // Save to localStorage
    const savedSessions = localStorage.getItem("reading_sessions")
    const existingSessions = savedSessions ? JSON.parse(savedSessions) : []
    localStorage.setItem("reading_sessions", JSON.stringify([...existingSessions, newSession]))

    // Reset form
    setSessionForm({ minutes: "", pages: "", bookTitle: "" })
    setIsAddSessionOpen(false)
  }

  const getWeekDays = () => {
    const days = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      days.push({
        date: date,
        dayName: date.toLocaleDateString("tr-TR", { weekday: "short" }),
        isToday: i === 0,
        hasActivity: i <= weekStreak && i > 0, // Mock data for now
      })
    }
    return days
  }

  return (
    <div className="space-y-6">
      {/* Daily Goal Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Bugünün Hedefi</CardTitle>
              <CardDescription>
                {isGoalComplete ? "Tebrikler! Günlük hedefinizi tamamladınız!" : "Okuma hedefine ulaşın"}
              </CardDescription>
            </div>
            {isGoalComplete && (
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">
                  {todayMinutes} / {dailyGoal} dakika
                </span>
              </div>
              <span className="text-muted-foreground">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          <div className="pt-2">
            <Label htmlFor="daily-goal-input" className="text-sm text-muted-foreground mb-2 block">
              Günlük Hedef (dakika)
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="daily-goal-input"
                type="number"
                min="5"
                max="240"
                value={dailyGoal}
                onChange={(e) => {
                  const newGoal = Number.parseInt(e.target.value) || 30
                  setDailyGoal(newGoal)
                  // Update user preferences
                  const userData = localStorage.getItem("bookmedia_user")
                  if (userData) {
                    const user = JSON.parse(userData)
                    user.preferences = { ...user.preferences, dailyGoal: newGoal }
                    localStorage.setItem("bookmedia_user", JSON.stringify(user))
                  }
                }}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">dakika</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Week Streak */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-600" />
            Haftalık Seri
          </CardTitle>
          <CardDescription>{weekStreak} gün üst üste okuma yapıyorsunuz!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between gap-2">
            {getWeekDays().map((day, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium ${
                    day.isToday
                      ? "bg-amber-500 text-white"
                      : day.hasActivity
                        ? "bg-green-100 text-green-700"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {day.hasActivity && !day.isToday ? <Check className="w-4 h-4" /> : day.date.getDate()}
                </div>
                <span className="text-xs text-muted-foreground">{day.dayName}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Session Button */}
      <Button
        onClick={() => setIsAddSessionOpen(true)}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Okuma Seansı Ekle
      </Button>

      {/* Today's Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-600" />
            Bugünün Seansları
          </CardTitle>
          <CardDescription>
            {sessions.length === 0
              ? "Henüz okuma seansı eklemediniz"
              : `${sessions.length} seans - Toplam ${sessions.reduce((sum, s) => sum + s.pages, 0)} sayfa`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              İlk okuma seansınızı ekleyerek başlayın!
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">{session.bookTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.minutes} dakika {session.pages > 0 && `• ${session.pages} sayfa`}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{todayMinutes}</p>
              <p className="text-xs text-muted-foreground">Bugün (dakika)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{weekStreak}</p>
              <p className="text-xs text-muted-foreground">Günlük Seri</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Session Dialog */}
      <Dialog open={isAddSessionOpen} onOpenChange={setIsAddSessionOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Okuma Seansı Ekle</DialogTitle>
            <DialogDescription>Bugün okuduğunuz süreyi ve sayfaları kaydedin</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="book-title">Kitap Adı *</Label>
              <Input
                id="book-title"
                value={sessionForm.bookTitle}
                onChange={(e) => setSessionForm({ ...sessionForm, bookTitle: e.target.value })}
                placeholder="Hangi kitabı okudunuz?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minutes">Okuma Süresi (dakika) *</Label>
              <Input
                id="minutes"
                type="number"
                min="1"
                value={sessionForm.minutes}
                onChange={(e) => setSessionForm({ ...sessionForm, minutes: e.target.value })}
                placeholder="Kaç dakika okudunuz?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pages">Okunan Sayfa (Opsiyonel)</Label>
              <Input
                id="pages"
                type="number"
                min="1"
                value={sessionForm.pages}
                onChange={(e) => setSessionForm({ ...sessionForm, pages: e.target.value })}
                placeholder="Kaç sayfa okudunuz?"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddSessionOpen(false)
                  setSessionForm({ minutes: "", pages: "", bookTitle: "" })
                }}
                className="flex-1"
              >
                İptal
              </Button>
              <Button
                onClick={handleAddSession}
                disabled={!sessionForm.minutes || !sessionForm.bookTitle}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
              >
                Kaydet
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
