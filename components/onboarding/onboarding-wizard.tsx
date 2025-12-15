"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { BookOpen, Target, TrendingUp, Users, ChevronRight, ChevronLeft } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const GENRES = [
  "Bilim Kurgu",
  "Fantastik",
  "Polisiye",
  "Romantik",
  "Tarih",
  "Biyografi",
  "Felsefe",
  "Psikoloji",
  "Kişisel Gelişim",
  "Klasik",
]

export function OnboardingWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [preferences, setPreferences] = useState({
    favoriteGenres: [] as string[],
    dailyGoal: 30,
    yearlyGoal: 24,
    notificationsEnabled: true,
  })

  const totalSteps = 3
  const progress = (step / totalSteps) * 100

  const toggleGenre = (genre: string) => {
    setPreferences((prev) => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.includes(genre)
        ? prev.favoriteGenres.filter((g) => g !== genre)
        : [...prev.favoriteGenres, genre],
    }))
  }

  const handleComplete = () => {
    // Save preferences to localStorage
    const user = JSON.parse(localStorage.getItem("bookmedia_user") || "{}")
    user.preferences = preferences
    user.onboarded = true
    localStorage.setItem("bookmedia_user", JSON.stringify(user))

    router.push("/dashboard")
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">Hoş Geldiniz!</h1>
          <span className="text-sm text-muted-foreground">
            Adım {step} / {totalSteps}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4">
            {step === 1 && <BookOpen className="w-6 h-6 text-white" />}
            {step === 2 && <Target className="w-6 h-6 text-white" />}
            {step === 3 && <TrendingUp className="w-6 h-6 text-white" />}
          </div>
          <CardTitle className="text-2xl">
            {step === 1 && "Favori Türleriniz"}
            {step === 2 && "Okuma Hedefleriniz"}
            {step === 3 && "Hazırsınız!"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Hangi türleri okumayı seviyorsunuz? (En az 3 tür seçin)"}
            {step === 2 && "Günlük ve yıllık okuma hedeflerinizi belirleyin"}
            {step === 3 && "Okuma yolculuğunuz başlamak üzere!"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    preferences.favoriteGenres.includes(genre)
                      ? "bg-amber-500 text-white"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="daily-goal">Günlük Okuma Hedefi (dakika)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="daily-goal"
                    type="number"
                    min="5"
                    max="240"
                    value={preferences.dailyGoal}
                    onChange={(e) =>
                      setPreferences((prev) => ({ ...prev, dailyGoal: Number.parseInt(e.target.value) || 30 }))
                    }
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">Günde {preferences.dailyGoal} dakika okuma</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearly-goal">Yıllık Kitap Hedefi</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="yearly-goal"
                    type="number"
                    min="1"
                    max="365"
                    value={preferences.yearlyGoal}
                    onChange={(e) =>
                      setPreferences((prev) => ({ ...prev, yearlyGoal: Number.parseInt(e.target.value) || 24 }))
                    }
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">Yılda {preferences.yearlyGoal} kitap okuma</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 py-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Akıllı Kütüphane</h3>
                  <p className="text-sm text-muted-foreground">
                    Kitaplarınızı kategorize edin ve okuma ilerlemesini takip edin
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Okuma Planlayıcı</h3>
                  <p className="text-sm text-muted-foreground">
                    Günlük hedefler belirleyin ve okuma alışkanlığınızı güçlendirin
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Sosyal Özellikler</h3>
                  <p className="text-sm text-muted-foreground">
                    Arkadaşlarınızla kitap önerileri paylaşın ve başarılarınızı karşılaştırın
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-6">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Geri
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={step === 1 && preferences.favoriteGenres.length < 3}
              className="ml-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            >
              {step === totalSteps ? "Başla" : "İleri"}
              {step < totalSteps && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
