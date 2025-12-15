"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, Target, TrendingUp, Calendar, Award } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function StatsView() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    booksReading: 0,
    booksFinished: 0,
    booksWantToRead: 0,
    totalPages: 0,
    averageRating: 0,
    favoriteGenre: "",
    currentStreak: 3,
    longestStreak: 7,
    totalReadingTime: 0,
    averageDailyTime: 0,
    thisMonthBooks: 0,
    yearlyGoal: 24,
    yearlyProgress: 0,
  })

  const [monthlyData, setMonthlyData] = useState<{ month: string; books: number }[]>([])

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem("bookmedia_user")
    let yearlyGoal = 24
    if (userData) {
      const user = JSON.parse(userData)
      yearlyGoal = user.preferences?.yearlyGoal || 24
    }

    // Calculate book statistics from localStorage
    const booksData = localStorage.getItem("bookmedia_books") || "[]"
    const books = JSON.parse(booksData)

    const totalBooks = books.length
    const booksReading = books.filter((b: any) => b.status === "reading").length
    const booksFinished = books.filter((b: any) => b.status === "finished").length
    const booksWantToRead = books.filter((b: any) => b.status === "want-to-read").length

    const finishedBooks = books.filter((b: any) => b.status === "finished")
    const totalPages = finishedBooks.reduce((sum: number, b: any) => sum + (b.totalPages || 0), 0)

    const ratedBooks = finishedBooks.filter((b: any) => b.rating > 0)
    const averageRating =
      ratedBooks.length > 0 ? ratedBooks.reduce((sum: number, b: any) => sum + b.rating, 0) / ratedBooks.length : 0

    // Genre statistics
    const genreCounts: { [key: string]: number } = {}
    books.forEach((book: any) => {
      if (book.genre) {
        genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1
      }
    })
    const favoriteGenre =
      Object.keys(genreCounts).length > 0
        ? Object.keys(genreCounts).reduce((a, b) => (genreCounts[a] > genreCounts[b] ? a : b))
        : "Henüz yok"

    // Reading time statistics
    const sessionsData = localStorage.getItem("reading_sessions") || "[]"
    const sessions = JSON.parse(sessionsData)
    const totalReadingTime = sessions.reduce((sum: number, s: any) => sum + (s.minutes || 0), 0)

    // Calculate average daily reading time (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentSessions = sessions.filter((s: any) => new Date(s.date) >= thirtyDaysAgo)
    const averageDailyTime = recentSessions.length > 0 ? totalReadingTime / 30 : 0

    // Books finished this month
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const thisMonthBooks = finishedBooks.filter((b: any) => {
      if (!b.finishDate) return false
      const finishDate = new Date(b.finishDate)
      return finishDate.getMonth() === currentMonth && finishDate.getFullYear() === currentYear
    }).length

    // Monthly reading data (last 6 months)
    const monthlyStats: { [key: string]: number } = {}
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const monthName = date.toLocaleDateString("tr-TR", { month: "short" })
      monthlyStats[monthName] = 0

      finishedBooks.forEach((book: any) => {
        if (book.finishDate && book.finishDate.startsWith(monthKey)) {
          monthlyStats[monthName]++
        }
      })
    }

    const monthlyDataArray = Object.entries(monthlyStats).map(([month, books]) => ({ month, books }))

    setMonthlyData(monthlyDataArray)
    setStats({
      totalBooks,
      booksReading,
      booksFinished,
      booksWantToRead,
      totalPages,
      averageRating: Math.round(averageRating * 10) / 10,
      favoriteGenre,
      currentStreak: 3, // Mock data
      longestStreak: 7, // Mock data
      totalReadingTime,
      averageDailyTime: Math.round(averageDailyTime),
      thisMonthBooks,
      yearlyGoal,
      yearlyProgress: Math.round((booksFinished / yearlyGoal) * 100),
    })
  }, [])

  const maxMonthlyBooks = Math.max(...monthlyData.map((d) => d.books), 1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">İstatistikler</h2>
        <p className="text-muted-foreground">Okuma alışkanlıklarınızı ve ilerlemenizi takip edin</p>
      </div>

      {/* Yearly Goal Card */}
      <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Target className="w-5 h-5" />
            Yıllık Hedef
          </CardTitle>
          <CardDescription className="text-white/90">
            {stats.yearlyGoal} kitap hedefi için {stats.booksFinished} kitap tamamlandı
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{stats.yearlyProgress}%</span>
              <span className="text-sm">
                {stats.booksFinished} / {stats.yearlyGoal}
              </span>
            </div>
            <Progress value={stats.yearlyProgress} className="h-3 bg-white/20" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <BookOpen className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.totalBooks}</p>
            <p className="text-xs text-muted-foreground">Toplam Kitap</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.booksFinished}</p>
            <p className="text-xs text-muted-foreground">Tamamlanan</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.totalReadingTime}</p>
            <p className="text-xs text-muted-foreground">Dakika Okuma</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.currentStreak}</p>
            <p className="text-xs text-muted-foreground">Günlük Seri</p>
          </CardContent>
        </Card>
      </div>

      {/* Reading Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Okuma İlerlemesi</CardTitle>
          <CardDescription>Kitap durumlarınızın dağılımı</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Okuduklarım</span>
              <span className="font-medium">{stats.booksReading} kitap</span>
            </div>
            <Progress
              value={(stats.booksReading / Math.max(stats.totalBooks, 1)) * 100}
              className="h-2 [&>div]:bg-amber-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Tamamladıklarım</span>
              <span className="font-medium">{stats.booksFinished} kitap</span>
            </div>
            <Progress
              value={(stats.booksFinished / Math.max(stats.totalBooks, 1)) * 100}
              className="h-2 [&>div]:bg-green-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Okumak İstediklerim</span>
              <span className="font-medium">{stats.booksWantToRead} kitap</span>
            </div>
            <Progress
              value={(stats.booksWantToRead / Math.max(stats.totalBooks, 1)) * 100}
              className="h-2 [&>div]:bg-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Monthly Reading Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Aylık Okuma Grafiği</CardTitle>
          <CardDescription>Son 6 aydaki kitap tamamlama sayınız</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyData.map((data) => (
              <div key={data.month} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium capitalize">{data.month}</span>
                  <span className="text-muted-foreground">{data.books} kitap</span>
                </div>
                <div className="h-8 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all"
                    style={{ width: `${(data.books / maxMonthlyBooks) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reading Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bu Ay</CardTitle>
            <CardDescription>Tamamlanan kitaplar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.thisMonthBooks}</p>
                <p className="text-sm text-muted-foreground">kitap</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Günlük Ortalama</CardTitle>
            <CardDescription>Okuma süresi (Son 30 gün)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.averageDailyTime}</p>
                <p className="text-sm text-muted-foreground">dakika</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Toplam Sayfa</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-600">{stats.totalPages.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-1">okunan sayfa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ortalama Puan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-600">{stats.averageRating || "—"}</p>
            <p className="text-sm text-muted-foreground mt-1">{stats.averageRating > 0 ? "/ 5 yıldız" : "Henüz yok"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Favori Tür</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">{stats.favoriteGenre}</p>
            <p className="text-sm text-muted-foreground mt-1">en çok okunan</p>
          </CardContent>
        </Card>
      </div>

      {/* Streaks */}
      <Card>
        <CardHeader>
          <CardTitle>Okuma Serileri</CardTitle>
          <CardDescription>Ardışık günlerdeki okuma performansınız</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-green-700">{stats.currentStreak}</p>
              <p className="text-sm text-green-600 mt-1">Mevcut Seri</p>
            </div>

            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-violet-50">
              <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-purple-700">{stats.longestStreak}</p>
              <p className="text-sm text-purple-600 mt-1">En Uzun Seri</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
