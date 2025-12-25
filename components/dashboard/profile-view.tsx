"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, Award, Star, BookOpen, Target, Zap, Flame, Crown, Lock, TrendingUp, Users, Medal, Camera, User } from "lucide-react"

const ACHIEVEMENTS = [
  {
    id: "first_book",
    title: "İlk Kitap",
    description: "İlk kitabınızı tamamlayın",
    icon: BookOpen,
    progress: 1,
    total: 1,
    unlocked: true,
    points: 10,
    rarity: "common",
  },
  {
    id: "week_streak",
    title: "Haftalık Seri",
    description: "7 gün üst üste okuma yapın",
    icon: Flame,
    progress: 3,
    total: 7,
    unlocked: false,
    points: 25,
    rarity: "rare",
  },
  {
    id: "book_5",
    title: "Kitap Kurdu",
    description: "5 kitap tamamlayın",
    icon: Target,
    progress: 3,
    total: 5,
    unlocked: false,
    points: 30,
    rarity: "rare",
  },
  {
    id: "book_10",
    title: "Okuma Tutkunu",
    description: "10 kitap tamamlayın",
    icon: Trophy,
    progress: 3,
    total: 10,
    unlocked: false,
    points: 50,
    rarity: "epic",
  },
  {
    id: "month_streak",
    title: "Aylık Dedikodu",
    description: "30 gün üst üste okuma yapın",
    icon: Crown,
    progress: 3,
    total: 30,
    unlocked: false,
    points: 100,
    rarity: "legendary",
  },
  {
    id: "fast_reader",
    title: "Hızlı Okuyucu",
    description: "Bir günde 100 sayfa okuyun",
    icon: Zap,
    progress: 0,
    total: 1,
    unlocked: false,
    points: 20,
    rarity: "rare",
  },
  {
    id: "review_master",
    title: "Eleştirmen",
    description: "10 kitaba puan verin",
    icon: Star,
    progress: 1,
    total: 10,
    unlocked: false,
    points: 15,
    rarity: "common",
  },
  {
    id: "social_butterfly",
    title: "Sosyal Kelebek",
    description: "5 arkadaş ekleyin",
    icon: Users,
    progress: 3,
    total: 5,
    unlocked: false,
    points: 20,
    rarity: "common",
  },
]

const LEADERBOARD = [
  {
    rank: 1,
    name: "Zeynep Kaya",
    avatar: "ZK",
    points: 850,
    booksRead: 45,
    isCurrentUser: false,
  },
  {
    rank: 2,
    name: "Ayşe Yılmaz",
    avatar: "AY",
    points: 720,
    booksRead: 32,
    isCurrentUser: false,
  },
  {
    rank: 3,
    name: "Mehmet Demir",
    avatar: "MD",
    points: 640,
    booksRead: 28,
    isCurrentUser: false,
  },
  {
    rank: 4,
    name: "Sen",
    avatar: "KU",
    points: 450,
    booksRead: 15,
    isCurrentUser: true,
  },
  {
    rank: 5,
    name: "Ali Özkan",
    avatar: "AÖ",
    points: 380,
    booksRead: 18,
    isCurrentUser: false,
  },
]

export function ProfileView() {
  const [totalPoints, setTotalPoints] = useState(450)
  const [level, setLevel] = useState(5)
  const [nextLevelPoints, setNextLevelPoints] = useState(500)
  const [user, setUser] = useState<any>(null)
  const [profilePhoto, setProfilePhoto] = useState("")

  useEffect(() => {
    const userData = localStorage.getItem("bookmedia_user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setProfilePhoto(parsedUser.profilePhoto || "")
    }
  }, [])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newPhoto = reader.result as string
        setProfilePhoto(newPhoto)
        // Update localStorage
        const userData = localStorage.getItem("bookmedia_user")
        if (userData) {
          const parsedUser = JSON.parse(userData)
          parsedUser.profilePhoto = newPhoto
          localStorage.setItem("bookmedia_user", JSON.stringify(parsedUser))
          setUser(parsedUser)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setProfilePhoto("")
    const userData = localStorage.getItem("bookmedia_user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      parsedUser.profilePhoto = ""
      localStorage.setItem("bookmedia_user", JSON.stringify(parsedUser))
      setUser(parsedUser)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-700 border-gray-300"
      case "rare":
        return "bg-blue-100 text-blue-700 border-blue-300"
      case "epic":
        return "bg-purple-100 text-purple-700 border-purple-300"
      case "legendary":
        return "bg-amber-100 text-amber-700 border-amber-300"
      default:
        return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-600" />
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Profil & Başarılar</h2>
        <p className="text-muted-foreground">Başarılarınızı keşfedin ve sıralamada yükselmeye çalışın</p>
      </div>

      {/* Profile Photo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profil Fotoğrafı</CardTitle>
          <CardDescription>Profil fotoğrafınızı ekleyin veya değiştirin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4">
            <Avatar className="w-32 h-32">
              {profilePhoto ? (
                <AvatarImage src={profilePhoto} alt="Profil" />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-4xl">
                  <User className="w-16 h-16" />
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col items-center gap-2">
              <Label htmlFor="profile-photo-edit" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                  <Camera className="w-4 h-4" />
                  <span>{profilePhoto ? "Fotoğrafı Değiştir" : "Fotoğraf Ekle"}</span>
                </div>
              </Label>
              <Input
                id="profile-photo-edit"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              {profilePhoto && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemovePhoto}
                >
                  Fotoğrafı Kaldır
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Level Card */}
      <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-white/90 mb-1">Seviyeniz</p>
              <p className="text-4xl font-bold">Seviye {level}</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>İlerleme</span>
              <span>
                {totalPoints} / {nextLevelPoints} puan
              </span>
            </div>
            <Progress value={(totalPoints / nextLevelPoints) * 100} className="h-2 bg-white/20" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements">Başarılar</TabsTrigger>
          <TabsTrigger value="leaderboard">Sıralama</TabsTrigger>
        </TabsList>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6 mt-6">
          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <Award className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{ACHIEVEMENTS.filter((a) => a.unlocked).length}</p>
                <p className="text-xs text-muted-foreground">Kazanılan</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Trophy className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{totalPoints}</p>
                <p className="text-xs text-muted-foreground">Toplam Puan</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {Math.round((ACHIEVEMENTS.filter((a) => a.unlocked).length / ACHIEVEMENTS.length) * 100)}%
                </p>
                <p className="text-xs text-muted-foreground">Tamamlama</p>
              </CardContent>
            </Card>
          </div>

          {/* Achievements Grid */}
          <div className="space-y-3">
            {ACHIEVEMENTS.map((achievement) => {
              const Icon = achievement.icon
              const progressPercentage = (achievement.progress / achievement.total) * 100

              return (
                <Card
                  key={achievement.id}
                  className={`${achievement.unlocked ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                          achievement.unlocked
                            ? "bg-gradient-to-br from-amber-500 to-orange-600"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {achievement.unlocked ? <Icon className="w-7 h-7 text-white" /> : <Lock className="w-6 h-6" />}
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold">{achievement.title}</h3>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                          <Badge variant="outline" className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                            +{achievement.points}
                          </Badge>
                        </div>

                        {!achievement.unlocked && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>İlerleme</span>
                              <span>
                                {achievement.progress} / {achievement.total}
                              </span>
                            </div>
                            <Progress value={progressPercentage} className="h-1.5" />
                          </div>
                        )}

                        {achievement.unlocked && (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">Kazanıldı!</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-600" />
                Küresel Sıralama
              </CardTitle>
              <CardDescription>En çok okuyan kullanıcılar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {LEADERBOARD.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    user.isCurrentUser ? "bg-amber-50 border border-amber-200" : "bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 text-center">
                      {getRankIcon(user.rank) || (
                        <span className="text-lg font-bold text-muted-foreground">{user.rank}</span>
                      )}
                    </div>

                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                        user.isCurrentUser
                          ? "bg-gradient-to-br from-amber-500 to-orange-600"
                          : "bg-gradient-to-br from-blue-500 to-purple-600"
                      }`}
                    >
                      {user.avatar}
                    </div>

                    <div className="flex-1">
                      <p className={`font-semibold ${user.isCurrentUser ? "text-amber-700" : ""}`}>{user.name}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{user.booksRead} kitap</span>
                        <span>•</span>
                        <span>{user.points} puan</span>
                      </div>
                    </div>
                  </div>

                  {user.isCurrentUser && <Badge className="bg-amber-500 hover:bg-amber-600">Siz</Badge>}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Weekly Challenge */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Bu Haftanın Meydan Okuması
              </CardTitle>
              <CardDescription>3 kitap tamamlayın ve 50 bonus puan kazanın</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>İlerleme</span>
                  <span className="font-medium">1 / 3 kitap</span>
                </div>
                <Progress value={33} className="h-2" />
                <p className="text-xs text-muted-foreground">6 gün kaldı</p>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Top Readers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-600" />
                Ayın En İyi Okuyucuları
              </CardTitle>
              <CardDescription>Bu ayki en aktif kullanıcılar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {LEADERBOARD.slice(0, 3).map((user, index) => (
                  <div key={user.rank} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground w-6">{index + 1}.</span>
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{user.booksRead} kitap</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
