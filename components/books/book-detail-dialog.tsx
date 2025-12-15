"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Trash2, Calendar, BookOpen } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface BookDetailDialogProps {
  book: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateBook: (book: any) => void
  onDeleteBook: (bookId: string) => void
}

export function BookDetailDialog({ book, open, onOpenChange, onUpdateBook, onDeleteBook }: BookDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editedBook, setEditedBook] = useState(book)

  const handleSave = () => {
    const progress = Math.round((editedBook.currentPage / editedBook.totalPages) * 100)
    const updatedBook = {
      ...editedBook,
      progress,
    }

    // Auto-finish book if current page equals total pages
    if (editedBook.currentPage >= editedBook.totalPages && editedBook.status !== "finished") {
      updatedBook.status = "finished"
      updatedBook.finishDate = new Date().toISOString().split("T")[0]
    }

    onUpdateBook(updatedBook)
    setIsEditing(false)
  }

  const handleStatusChange = (newStatus: string) => {
    const updates: any = { status: newStatus }

    if (newStatus === "reading" && !editedBook.startDate) {
      updates.startDate = new Date().toISOString().split("T")[0]
    }

    if (newStatus === "finished") {
      updates.finishDate = new Date().toISOString().split("T")[0]
      updates.currentPage = editedBook.totalPages
      updates.progress = 100
    }

    setEditedBook({ ...editedBook, ...updates })
  }

  const handleRatingClick = (rating: number) => {
    setEditedBook({ ...editedBook, rating: rating === editedBook.rating ? 0 : rating })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kitap Detayları</DialogTitle>
            <DialogDescription>
              {isEditing ? "Kitap bilgilerini düzenleyin" : "Kitap bilgilerini görüntüleyin"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Book Cover and Basic Info */}
            <div className="flex gap-4">
              <div className="w-32 h-48 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                <img
                  src={
                    editedBook.cover ||
                    `/placeholder.svg?height=300&width=200&query=${encodeURIComponent(editedBook.title) || "/placeholder.svg"}`
                  }
                  alt={editedBook.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-2xl font-bold text-balance">{editedBook.title}</h3>
                  <p className="text-muted-foreground">{editedBook.author}</p>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {editedBook.totalPages} sayfa {editedBook.genre && `• ${editedBook.genre}`}
                  </span>
                </div>
                {editedBook.startDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Başlangıç: {new Date(editedBook.startDate).toLocaleDateString("tr-TR")}
                      {editedBook.finishDate &&
                        ` • Bitiş: ${new Date(editedBook.finishDate).toLocaleDateString("tr-TR")}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Durum</Label>
              <Select value={editedBook.status} onValueChange={handleStatusChange} disabled={!isEditing}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="want-to-read">Okumak İstiyorum</SelectItem>
                  <SelectItem value="reading">Okuyorum</SelectItem>
                  <SelectItem value="finished">Tamamladım</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reading Progress */}
            {(editedBook.status === "reading" || editedBook.status === "finished") && (
              <div className="space-y-2">
                <Label htmlFor="currentPage">Mevcut Sayfa</Label>
                <Input
                  id="currentPage"
                  type="number"
                  min="0"
                  max={editedBook.totalPages}
                  value={editedBook.currentPage}
                  onChange={(e) =>
                    setEditedBook({
                      ...editedBook,
                      currentPage: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  disabled={!isEditing}
                />
                <div className="pt-2">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">İlerleme</span>
                    <span className="font-medium">
                      {Math.round((editedBook.currentPage / editedBook.totalPages) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all"
                      style={{
                        width: `${(editedBook.currentPage / editedBook.totalPages) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Rating */}
            <div className="space-y-2">
              <Label>Puanınız</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => isEditing && handleRatingClick(star)}
                    disabled={!isEditing}
                    className="transition-colors disabled:cursor-default"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= editedBook.rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notlar</Label>
              <Textarea
                id="notes"
                value={editedBook.notes}
                onChange={(e) => setEditedBook({ ...editedBook, notes: e.target.value })}
                placeholder="Kitap hakkında notlarınız..."
                rows={4}
                disabled={!isEditing}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button onClick={() => setIsEditing(true)} className="flex-1">
                    Düzenle
                  </Button>
                  <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                    Kapat
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => setShowDeleteDialog(true)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  >
                    Kaydet
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditedBook(book)
                      setIsEditing(false)
                    }}
                    className="flex-1"
                  >
                    İptal
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kitabı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              {editedBook.title} kitabını kütüphanenizden silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDeleteBook(editedBook.id)
                setShowDeleteDialog(false)
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
