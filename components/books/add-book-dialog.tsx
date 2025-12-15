"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

interface AddBookDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddBook: (book: any) => void
}

export function AddBookDialog({ open, onOpenChange, onAddBook }: AddBookDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    totalPages: "",
    genre: "",
    status: "want-to-read",
    cover: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.author || !formData.totalPages) {
      return
    }

    onAddBook({
      ...formData,
      totalPages: Number.parseInt(formData.totalPages),
      startDate: formData.status === "reading" ? new Date().toISOString().split("T")[0] : null,
    })

    // Reset form
    setFormData({
      title: "",
      author: "",
      totalPages: "",
      genre: "",
      status: "want-to-read",
      cover: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Kitap Ekle</DialogTitle>
          <DialogDescription>Kütüphanenize yeni bir kitap ekleyin</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Kitap Adı *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Örn: Suç ve Ceza"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Yazar *</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Örn: Fyodor Dostoyevski"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pages">Toplam Sayfa Sayısı *</Label>
            <Input
              id="pages"
              type="number"
              min="1"
              value={formData.totalPages}
              onChange={(e) => setFormData({ ...formData, totalPages: e.target.value })}
              placeholder="Örn: 580"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Tür</Label>
            <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
              <SelectTrigger id="genre">
                <SelectValue placeholder="Tür seçin" />
              </SelectTrigger>
              <SelectContent>
                {GENRES.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Durum</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="want-to-read">Okumak İstiyorum</SelectItem>
                <SelectItem value="reading">Okuyorum</SelectItem>
                <SelectItem value="finished">Tamamladım</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover">Kapak Resmi URL (Opsiyonel)</Label>
            <Input
              id="cover"
              value={formData.cover}
              onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
              placeholder="https://example.com/cover.jpg"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              İptal
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            >
              Ekle
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
