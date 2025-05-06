"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addBook } from "@/app/actions/book-actions"

export default function AddBookPage() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    publishedDate: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    await addBook(formData)
    setIsSubmitting(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-6 w-6" />
          <span>LibrarySystem</span>
        </Link>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-muted/40">
          <nav className="grid gap-2 p-4">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <BookOpen className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/books"
              className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-primary-foreground"
            >
              <BookOpen className="h-5 w-5" />
              Books
            </Link>
            <Link
              href="/users"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <BookOpen className="h-5 w-5" />
              Users
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <Button variant="outline" size="sm" asChild className="mb-6">
              <Link href="/books">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Books
              </Link>
            </Button>

            <h1 className="text-2xl font-semibold">Add New Book</h1>
            <p className="text-muted-foreground">Enter the details of the new book to add to the library.</p>
          </div>

          <Card className="max-w-2xl">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Book Information</CardTitle>
                <CardDescription>Fill in the book details. All fields marked with * are required.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter book title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author *</Label>
                    <Input
                      id="author"
                      name="author"
                      placeholder="Enter author name"
                      value={formData.author}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="isbn">ISBN *</Label>
                    <Input
                      id="isbn"
                      name="isbn"
                      placeholder="Enter ISBN number"
                      value={formData.isbn}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="genre">Genre *</Label>
                    <Select
                      name="genre"
                      value={formData.genre}
                      onValueChange={(value) => handleSelectChange("genre", value)}
                      required
                    >
                      <SelectTrigger id="genre">
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fiction">Fiction</SelectItem>
                        <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                        <SelectItem value="Science Fiction">Science Fiction</SelectItem>
                        <SelectItem value="Fantasy">Fantasy</SelectItem>
                        <SelectItem value="Mystery">Mystery</SelectItem>
                        <SelectItem value="Thriller">Thriller</SelectItem>
                        <SelectItem value="Romance">Romance</SelectItem>
                        <SelectItem value="Biography">Biography</SelectItem>
                        <SelectItem value="History">History</SelectItem>
                        <SelectItem value="Self-Help">Self-Help</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Children">Children</SelectItem>
                        <SelectItem value="Young Adult">Young Adult</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publishedDate">Publication Date</Label>
                  <Input
                    id="publishedDate"
                    name="publishedDate"
                    type="date"
                    value={formData.publishedDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter book description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" asChild>
                  <Link href="/books">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Book"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </main>
      </div>
    </div>
  )
}
