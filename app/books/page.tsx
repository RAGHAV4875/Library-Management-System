import Link from "next/link"
import { BookOpen, ChevronDown, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { getBooks } from "../actions/book-actions"

export default async function BooksPage() {
  const { books = [] } = await getBooks()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-6 w-6" />
          <span>LibrarySystem</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <form className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search books..."
              className="w-64 rounded-lg bg-background pl-8"
              name="search"
            />
          </form>
        </div>
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
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Book Catalog</h1>
            <Button asChild>
              <Link href="/books/add">Add New Book</Link>
            </Button>
          </div>

          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by title, author, or ISBN..."
                      className="w-80 pl-8"
                      name="search"
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Genre
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Filter by Genre</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {["Fiction", "Self-Help", "Science Fiction", "Finance", "Memoir", "Thriller", "History"].map(
                        (genre) => (
                          <DropdownMenuCheckboxItem key={genre} checked={false}>
                            {genre}
                          </DropdownMenuCheckboxItem>
                        ),
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Status
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {["AVAILABLE", "CHECKED_OUT", "ON_HOLD"].map((status) => (
                        <DropdownMenuCheckboxItem key={status} checked={false}>
                          {status.replace("_", " ")}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="text-sm text-muted-foreground">Showing {books.length} books</div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Genre</TableHead>
                      <TableHead>ISBN</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {books.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell className="font-medium">{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>{book.genre}</TableCell>
                        <TableCell className="font-mono text-xs">{book.isbn}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              book.status === "AVAILABLE"
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : book.status === "CHECKED_OUT"
                                  ? "bg-red-100 text-red-800 hover:bg-red-200"
                                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            }
                          >
                            {book.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/books/${book.id}`}>View</Link>
                            </Button>
                            {book.status === "AVAILABLE" ? (
                              <Button size="sm">Checkout</Button>
                            ) : book.status === "CHECKED_OUT" ? (
                              <Button size="sm" variant="outline">
                                Return
                              </Button>
                            ) : null}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
