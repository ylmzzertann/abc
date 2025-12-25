"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return "Şifre en az 8 karakter olmalıdır"
    }
    if (!/[a-zA-Z]/.test(pwd)) {
      return "Şifre en az 1 harf içermelidir"
    }
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!isLogin) {
      // Registration validation
      if (!firstName.trim()) {
        newErrors.firstName = "İsim gereklidir"
      }
      if (!lastName.trim()) {
        newErrors.lastName = "Soyisim gereklidir"
      }
      if (!username.trim()) {
        newErrors.username = "Kullanıcı adı gereklidir"
      }
      if (!birthDate) {
        newErrors.birthDate = "Doğum tarihi gereklidir"
      }
      if (!password) {
        newErrors.password = "Şifre gereklidir"
      } else {
        const passwordError = validatePassword(password)
        if (passwordError) {
          newErrors.password = passwordError
        }
      }
      if (password !== passwordConfirm) {
        newErrors.passwordConfirm = "Şifreler eşleşmiyor"
      }
      if (!passwordConfirm) {
        newErrors.passwordConfirm = "Şifre tekrarı gereklidir"
      }
    } else {
      // Login validation
      if (!email) {
        newErrors.email = "E-posta gereklidir"
      }
      if (!password) {
        newErrors.password = "Şifre gereklidir"
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})

    // Mock authentication - store user data in localStorage
    const userData = {
      id: Date.now().toString(),
      email,
      firstName: isLogin ? undefined : firstName,
      lastName: isLogin ? undefined : lastName,
      name: isLogin ? "Kullanıcı" : `${firstName} ${lastName}`,
      username: isLogin ? undefined : username,
      birthDate: isLogin ? undefined : birthDate,
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
            <>
              <div className="space-y-2">
                <Label htmlFor="firstName">İsim</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Adınız"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value)
                    if (errors.firstName) {
                      setErrors((prev) => ({ ...prev, firstName: "" }))
                    }
                  }}
                  required={!isLogin}
                  aria-invalid={!!errors.firstName}
                />
                {errors.firstName && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">{errors.firstName}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Soyisim</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Soyadınız"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value)
                    if (errors.lastName) {
                      setErrors((prev) => ({ ...prev, lastName: "" }))
                    }
                  }}
                  required={!isLogin}
                  aria-invalid={!!errors.lastName}
                />
                {errors.lastName && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">{errors.lastName}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Kullanıcı Adı</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="kullaniciadi"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    if (errors.username) {
                      setErrors((prev) => ({ ...prev, username: "" }))
                    }
                  }}
                  required={!isLogin}
                  aria-invalid={!!errors.username}
                />
                {errors.username && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">{errors.username}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Doğum Tarihi</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => {
                    setBirthDate(e.target.value)
                    if (errors.birthDate) {
                      setErrors((prev) => ({ ...prev, birthDate: "" }))
                    }
                  }}
                  required={!isLogin}
                  aria-invalid={!!errors.birthDate}
                />
                {errors.birthDate && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">{errors.birthDate}</AlertDescription>
                  </Alert>
                )}
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: "" }))
                }
              }}
              required
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{errors.email}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: "" }))
                }
                // Clear password confirm error if passwords match now
                if (e.target.value === passwordConfirm && errors.passwordConfirm === "Şifreler eşleşmiyor") {
                  setErrors((prev) => ({ ...prev, passwordConfirm: "" }))
                }
              }}
              required
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{errors.password}</AlertDescription>
              </Alert>
            )}
            {!isLogin && !errors.password && (
              <p className="text-xs text-muted-foreground">En az 8 karakter ve en az 1 harf içermelidir</p>
            )}
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">Şifre Tekrar</Label>
              <Input
                id="passwordConfirm"
                type="password"
                placeholder="••••••••"
                value={passwordConfirm}
                onChange={(e) => {
                  setPasswordConfirm(e.target.value)
                  if (errors.passwordConfirm) {
                    setErrors((prev) => ({ ...prev, passwordConfirm: "" }))
                  }
                  // Check if passwords match in real-time
                  if (e.target.value !== password && e.target.value.length > 0) {
                    setErrors((prev) => ({ ...prev, passwordConfirm: "Şifreler eşleşmiyor" }))
                  }
                }}
                required={!isLogin}
                aria-invalid={!!errors.passwordConfirm}
              />
              {errors.passwordConfirm && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">{errors.passwordConfirm}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

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
            onClick={() => {
              setIsLogin(!isLogin)
              setErrors({})
              setFirstName("")
              setLastName("")
              setUsername("")
              setBirthDate("")
              setPasswordConfirm("")
            }}
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            {isLogin ? "Hesabınız yok mu? Kayıt olun" : "Zaten hesabınız var mı? Giriş yapın"}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
