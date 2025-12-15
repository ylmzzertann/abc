"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Mock authentication - store user data in localStorage
    const userData = {
      id: Date.now().toString(),
      email,
      name: isLogin ? "Kullanıcı" : name,
      isNewUser: !isLogin,
    }

    localStorage.setItem("bookmedia_user", JSON.stringify(userData))

    // Redirect to onboarding for new users, dashboard for existing users
    if (!isLogin) {
      router.push("/onboarding")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <Card className="w-full max-w-md mx-4">
      <CardHeader className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-balance">BookMedia</CardTitle>
        <CardDescription className="text-base">
          {isLogin ? "Hesabınıza giriş yapın" : "Yeni hesap oluşturun"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input
                id="name"
                type="text"
                placeholder="Adınız Soyadınız"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          >
            {isLogin ? "Giriş Yap" : "Kayıt Ol"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            {isLogin ? "Hesabınız yok mu? Kayıt olun" : "Zaten hesabınız var mı? Giriş yapın"}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
