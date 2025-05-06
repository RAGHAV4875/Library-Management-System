import Link from "next/link"
import { ArrowLeft, BookOpen, Calendar, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getBookById, getBookCheckoutHistory, getCurrentBookCheckout } from "@/app/actions/book-actions"
import CheckoutBookButton from "./checkout-button"
import ReturnBookButton from "./return-button"

export default async function BookDetailsPage({ params }: { params: { id: string } }) {
  const { book, error: bookError } = await getBookById(params.id)
  const { checkouts = [] } = await getBookCheckoutHistory(params.id)
  const { checkout } = await getCurrentBookCheckout(params.id)

  if (bookError || !book) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Book Not Found</CardTitle>
            <CardDescription>The book you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/books">Back to Books</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
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

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">{book.title}</h1>
                <p className="text-muted-foreground">by {book.author}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Book
                </Button>
                {book.status === "AVAILABLE" ? (
                  <CheckoutBookButton bookId={book.id.toString()} />
                ) : book.status === "CHECKED_OUT" ? (
                  <ReturnBookButton bookId={book.id.toString()} />
                ) : null}
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <Badge
                variant="outline"
                className={
                  book.status === "AVAILABLE"
                    ? "bg-green-100 text-green-800"
                    : book.status === "CHECKED_OUT"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                }
              >
                {book.status.replace("_", " ")}
              </Badge>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-sm text-muted-foreground">ISBN: {book.isbn}</span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Book Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="info">
                  <TabsList className="mb-4">
                    <TabsTrigger value="info">Information</TabsTrigger>
                    <TabsTrigger value="history">Checkout History</TabsTrigger>
                  </TabsList>
                  <TabsContent value="info" className="space-y-4">
                    <div>
                      <h3 className="font-medium">Description</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {book.description || "No description available."}
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="font-medium">Genre</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{book.genre}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Publication Date</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {book.published_date ? new Date(book.published_date).toLocaleDateString() : "Unknown"}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">ISBN</h3>
                        <p className="mt-1 text-sm font-mono text-muted-foreground">{book.isbn}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Status</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{book.status.replace("_", " ")}</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="history">
                    <div className="rounded-md border">
                      <div className="p-4">
                        <h3 className="font-medium">Recent Checkout History</h3>
                        <p className="text-sm text-muted-foreground">Record of previous checkouts</p>
                      </div>
                      <div className="p-4">
                        {checkouts.length > 0 ? (
                          <div className="space-y-4">
                            {checkouts.map((history) => (
                              <div key={history.id} className="flex items-start gap-4 rounded-lg border p-3">
                                <div>
                                  <p className="font-medium">{history.user_name}</p>
                                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3.5 w-3.5" />
                                      Checked out: {new Date(history.checkout_date).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3.5 w-3.5" />
                                      Returned:{" "}
                                      {history.return_date
                                        ? new Date(history.return_date).toLocaleDateString()
                                        : "Not returned"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-lg border-2 border-dashed p-8 text-center">
                            <p className="text-muted-foreground">No checkout history available for this book</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
              </CardHeader>
              <CardContent>
                {book.status === "AVAILABLE" ? (
                  <div className="rounded-lg bg-green-50 p-4 text-green-800">
                    <h3 className="font-medium">Available for Checkout</h3>
                    <p className="mt-1 text-sm">This book is currently available in the library.</p>
                  </div>
                ) : book.status === "CHECKED_OUT" && checkout ? (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-red-50 p-4 text-red-800">
                      <h3 className="font-medium">Currently Checked Out</h3>
                      <p className="mt-1 text-sm">This book is currently checked out.</p>
                    </div>

                    <div>
                      <h3 className="font-medium">Borrower Information</h3>
                      <div className="mt-2 rounded-lg border p-3">
                        <p className="font-medium">{checkout.user_name}</p>
                        <div className="mt-1 grid gap-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Checkout Date: {new Date(checkout.checkout_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Due Date: {new Date(checkout.due_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : book.status === "ON_HOLD" ? (
                  <div className="rounded-lg bg-yellow-50 p-4 text-yellow-800">
                    <h3 className="font-medium">On Hold</h3>
                    <p className="mt-1 text-sm">This book is currently on hold and not available for checkout.</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
