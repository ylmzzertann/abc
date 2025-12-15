"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Book, Clock, CheckCircle2, Search, BookOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { AddBookDialog } from "@/components/books/add-book-dialog"
import { BookDetailDialog } from "@/components/books/book-detail-dialog"

const MOCK_BOOKS = [
  {
    id: "1",
    title: "Suç ve Ceza",
    author: "Fyodor Dostoyevski",
    cover: "/su--ve-ceza-book-cover.jpg",
    status: "reading",
    progress: 45,
    totalPages: 580,
    currentPage: 261,
    genre: "Klasik",
    rating: 0,
    startDate: "2024-01-15",
    notes: "",
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    cover: "/1984-book-cover.png",
    status: "want-to-read",
    progress: 0,
    totalPages: 328,
    currentPage: 0,
    genre: "Bilim Kurgu",
    rating: 0,
    startDate: null,
    notes: "",
  },
  {
    id: "3",
    title: "İnce Memed",
    author: "Yaşar Kemal",
    cover: "/-nce-memed-book-cover.jpg",
    status: "finished",
    progress: 100,
    totalPages: 456,
    currentPage: 456,
    genre: "Klasik",
    rating: 5,
    startDate: "2023-12-01",
    finishDate: "2024-01-10",
    notes: "Harika bir roman!",
  },
]

type ShelfType = "all" | "reading" | "want-to-read" | "finished"

export function LibraryView() {
  const [activeShelf, setActiveShelf] = useState<ShelfType>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<any>(null)
  const [books, setBooks] = useState(MOCK_BOOKS)

  const shelves = [
    { id: "all" as ShelfType, label: "Tümü", count: books.length },
    {
      id: "reading" as ShelfType,
      label: "Okuduklarım",
      count: books.filter((b) => b.status === "reading").length,
    },
    {
      id: "want-to-read" as ShelfType,
      label: "Okumak İstediklerim",
      count: books.filter((b) => b.status === "want-to-read").length,
    },
    {
      id: "finished" as ShelfType,
      label: "Tamamladıklarım",
      count: books.filter((b) => b.status === "finished").length,
    },
  ]

  const filteredBooks = books.filter((book) => {
    const matchesShelf = activeShelf === "all" || book.status === activeShelf
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesShelf && matchesSearch
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "reading":
        return <Book className="w-4 h-4 text-amber-600" />
      case "want-to-read":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "finished":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      default:
        return null
    }
  }

  const handleAddBook = (bookData: any) => {
    const newBook = {
      ...bookData,
      id: Date.now().toString(),
      progress: 0,
      currentPage: 0,
      rating: 0,
      notes: "",
    }
    setBooks([...books, newBook])
    setIsAddDialogOpen(false)
  }

  const handleUpdateBook = (updatedBook: any) => {
    setBooks(books.map((book) => (book.id === updatedBook.id ? updatedBook : book)))
    setSelectedBook(null)
  }

  const handleDeleteBook = (bookId: string) => {
    setBooks(books.filter((book) => book.id !== bookId))
    setSelectedBook(null)
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Kitap veya yazar ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Shelf Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {shelves.map((shelf) => (
          <button
            key={shelf.id}
            onClick={() => setActiveShelf(shelf.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeShelf === shelf.id ? "bg-amber-500 text-white" : "bg-muted hover:bg-muted/80"
            }`}
          >
            {shelf.label} ({shelf.count})
          </button>
        ))}
      </div>

      <Button
        onClick={() => setIsAddDialogOpen(true)}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Yeni Kitap Ekle
      </Button>

      {/* Books Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredBooks.map((book) => (
          <Card
            key={book.id}
            onClick={() => setSelectedBook(book)}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <CardContent className="p-0">
              <div className="aspect-[2/3] relative">
                <img
                  src={book.cover || `/placeholder.svg?height=400&width=300&query=${encodeURIComponent(book.title)}`}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/90 backdrop-blur flex items-center justify-center">
                  {getStatusIcon(book.status)}
                </div>
              </div>
              <div className="p-3 space-y-1">
                <h3 className="font-semibold text-sm line-clamp-2 text-balance">{book.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
                {book.status === "reading" && (
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">İlerleme</span>
                      <span className="font-medium">{book.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-600"
                        style={{ width: `${book.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {book.currentPage} / {book.totalPages} sayfa
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Henüz kitap yok</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Arama kriterlerine uygun kitap bulunamadı." : "Kütüphanenize ilk kitabınızı ekleyin!"}
          </p>
        </div>
      )}

      <AddBookDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAddBook={handleAddBook} />

      {selectedBook && (
        <BookDetailDialog
          book={selectedBook}
          open={!!selectedBook}
          onOpenChange={(open) => !open && setSelectedBook(null)}
          onUpdateBook={handleUpdateBook}
          onDeleteBook={handleDeleteBook}
        />
      )}
    </div>
  )
}
