"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  UserPlus,
  BookOpen,
  MessageCircle,
  Heart,
  Share2,
  Trophy,
  Clock,
  Star,
  Search,
  TrendingUp,
} from "lucide-react"

const MOCK_FRIENDS = [
  {
    id: "1",
    name: "Ayşe Yılmaz",
    avatar: "AY",
    booksRead: 32,
    currentStreak: 12,
    isFriend: true,
  },
  {
    id: "2",
    name: "Mehmet Demir",
    avatar: "MD",
    booksRead: 28,
    currentStreak: 8,
    isFriend: true,
  },
  {
    id: "3",
    name: "Zeynep Kaya",
    avatar: "ZK",
    booksRead: 45,
    currentStreak: 15,
    isFriend: true,
  },
]

const MOCK_SUGGESTIONS = [
  {
    id: "4",
    name: "Ali Özkan",
    avatar: "AÖ",
    mutualFriends: 3,
    booksRead: 18,
  },
  {
    id: "5",
    name: "Fatma Şahin",
    avatar: "FŞ",
    mutualFriends: 5,
    booksRead: 22,
  },
]

const MOCK_ACTIVITIES = [
  {
    id: "1",
    user: { name: "Ayşe Yılmaz", avatar: "AY" },
    type: "finished",
    book: { title: "1984", author: "George Orwell" },
    rating: 5,
    comment: "Harika bir distopya klasiği! Herkesin okuması gereken bir kitap.",
    time: "2 saat önce",
    likes: 12,
    comments: 3,
  },
  {
    id: "2",
    user: { name: "Mehmet Demir", avatar: "MD" },
    type: "reading",
    book: { title: "Suç ve Ceza", author: "Fyodor Dostoyevski" },
    progress: 65,
    time: "5 saat önce",
    likes: 8,
    comments: 1,
  },
  {
    id: "3",
    user: { name: "Zeynep Kaya", avatar: "ZK" },
    type: "achievement",
    achievement: "10 Günlük Seri Tamamlandı!",
    time: "1 gün önce",
    likes: 15,
    comments: 5,
  },
  {
    id: "4",
    user: { name: "Ayşe Yılmaz", avatar: "AY" },
    type: "recommendation",
    book: { title: "İnce Memed", author: "Yaşar Kemal" },
    comment: "Türk edebiyatının başyapıtlarından biri. Mutlaka okuyun!",
    time: "2 gün önce",
    likes: 20,
    comments: 7,
  },
]

const MOCK_RECOMMENDATIONS = [
  {
    id: "1",
    book: { title: "Beyaz Diş", author: "Jack London", cover: "/placeholder.svg" },
    recommendedBy: "Ayşe Yılmaz",
    reason: "Macera türünü sevdiğin için",
  },
  {
    id: "2",
    book: { title: "Simyacı", author: "Paulo Coelho", cover: "/placeholder.svg" },
    recommendedBy: "Mehmet Demir",
    reason: "Kişisel gelişim kitaplarına ilgin var",
  },
]

export function SocialView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [friends, setFriends] = useState(MOCK_FRIENDS)
  const [suggestions, setSuggestions] = useState(MOCK_SUGGESTIONS)
  const [activities, setActivities] = useState(MOCK_ACTIVITIES)

  const handleAddFriend = (userId: string) => {
    const userToAdd = suggestions.find((s) => s.id === userId)
    if (userToAdd) {
      setFriends([...friends, { ...userToAdd, currentStreak: 0, isFriend: true }])
      setSuggestions(suggestions.filter((s) => s.id !== userId))
    }
  }

  const handleLike = (activityId: string) => {
    setActivities(
      activities.map((activity) =>
        activity.id === activityId ? { ...activity, likes: activity.likes + 1 } : activity,
      ),
    )
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "finished":
        return <BookOpen className="w-4 h-4 text-green-600" />
      case "reading":
        return <Clock className="w-4 h-4 text-amber-600" />
      case "achievement":
        return <Trophy className="w-4 h-4 text-purple-600" />
      case "recommendation":
        return <Star className="w-4 h-4 text-blue-600" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Sosyal</h2>
        <p className="text-muted-foreground">Arkadaşlarınızla kitap deneyimlerinizi paylaşın</p>
      </div>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="feed">Akış</TabsTrigger>
          <TabsTrigger value="friends">Arkadaşlar</TabsTrigger>
          <TabsTrigger value="recommendations">Öneriler</TabsTrigger>
        </TabsList>

        {/* Activity Feed */}
        <TabsContent value="feed" className="space-y-4 mt-6">
          {activities.map((activity) => (
            <Card key={activity.id}>
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-sm">
                      {activity.user.avatar}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm">{activity.user.name}</p>
                        <span className="text-xs text-muted-foreground">• {activity.time}</span>
                      </div>

                      {activity.type === "finished" && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {getActivityIcon(activity.type)}
                            <span>bir kitabı tamamladı</span>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="font-semibold">{activity.book?.title}</p>
                            <p className="text-sm text-muted-foreground">{activity.book?.author}</p>
                            {activity.rating && (
                              <div className="flex gap-1 mt-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < activity.rating! ? "fill-amber-500 text-amber-500" : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          {activity.comment && <p className="text-sm mt-2">{activity.comment}</p>}
                        </div>
                      )}

                      {activity.type === "reading" && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {getActivityIcon(activity.type)}
                            <span>okumaya devam ediyor</span>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="font-semibold">{activity.book?.title}</p>
                            <p className="text-sm text-muted-foreground mb-2">{activity.book?.author}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-amber-500 to-orange-600"
                                  style={{ width: `${activity.progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">{activity.progress}%</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {activity.type === "achievement" && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {getActivityIcon(activity.type)}
                            <span>bir başarı kazandı</span>
                          </div>
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200">
                            <p className="font-semibold text-purple-700">{activity.achievement}</p>
                          </div>
                        </div>
                      )}

                      {activity.type === "recommendation" && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {getActivityIcon(activity.type)}
                            <span>bir kitap önerdi</span>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="font-semibold">{activity.book?.title}</p>
                            <p className="text-sm text-muted-foreground">{activity.book?.author}</p>
                          </div>
                          {activity.comment && <p className="text-sm mt-2">{activity.comment}</p>}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 pt-2 border-t">
                      <button
                        onClick={() => handleLike(activity.id)}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        <span>{activity.likes}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span>{activity.comments}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-amber-500 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Friends Tab */}
        <TabsContent value="friends" className="space-y-6 mt-6">
          {/* Search Friends */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Arkadaş ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Friends List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" />
                Arkadaşlarım ({friends.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {friends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                        {friend.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{friend.name}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {friend.booksRead} kitap
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {friend.currentStreak} günlük seri
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Profil
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Friend Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-600" />
                Arkadaş Önerileri
              </CardTitle>
              <CardDescription>Ortak arkadaşlarınız olan kişiler</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {suggestion.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{suggestion.name}</p>
                      <p className="text-xs text-muted-foreground">{suggestion.mutualFriends} ortak arkadaş</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAddFriend(suggestion.id)}
                    size="sm"
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Ekle
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-600" />
                Arkadaşlardan Öneriler
              </CardTitle>
              <CardDescription>Arkadaşlarınızın size önerdiği kitaplar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {MOCK_RECOMMENDATIONS.map((rec) => (
                <div key={rec.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-16 h-24 bg-muted rounded flex-shrink-0">
                    <img
                      src={`/.jpg?height=120&width=80&query=${encodeURIComponent(rec.book.title)}`}
                      alt={rec.book.title}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{rec.book.title}</p>
                    <p className="text-sm text-muted-foreground">{rec.book.author}</p>
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {rec.recommendedBy} tarafından önerildi
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{rec.reason}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Ekle
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                Sizin İçin Öneriler
              </CardTitle>
              <CardDescription>Okuma geçmişinize göre önerilen kitaplar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground text-sm">
                Daha fazla kitap okudukça size özel öneriler görünecek!
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
