"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { sql, type Book, type Checkout } from "@/lib/db"

export async function getBooks() {
  try {
    const books = await sql<Book[]>`
      SELECT * FROM books
      ORDER BY title ASC
    `
    return { books }
  } catch (error) {
    console.error("Failed to fetch books:", error)
    return { error: "Failed to fetch books" }
  }
}

export async function getBookById(id: string) {
  try {
    const [book] = await sql<Book[]>`
      SELECT * FROM books
      WHERE id = ${Number.parseInt(id)}
    `

    if (!book) {
      return { error: "Book not found" }
    }

    return { book }
  } catch (error) {
    console.error("Failed to fetch book:", error)
    return { error: "Failed to fetch book" }
  }
}

export async function getBookCheckoutHistory(bookId: string) {
  try {
    const checkouts = await sql<(Checkout & { user_name: string })[]>`
      SELECT c.*, u.name as user_name
      FROM checkouts c
      JOIN users u ON c.user_id = u.id
      WHERE c.book_id = ${Number.parseInt(bookId)}
      AND c.return_date IS NOT NULL
      ORDER BY c.checkout_date DESC
    `

    return { checkouts }
  } catch (error) {
    console.error("Failed to fetch checkout history:", error)
    return { error: "Failed to fetch checkout history" }
  }
}

export async function getCurrentBookCheckout(bookId: string) {
  try {
    const [checkout] = await sql<(Checkout & { user_name: string })[]>`
      SELECT c.*, u.name as user_name
      FROM checkouts c
      JOIN users u ON c.user_id = u.id
      WHERE c.book_id = ${Number.parseInt(bookId)}
      AND c.return_date IS NULL
      ORDER BY c.checkout_date DESC
      LIMIT 1
    `

    return { checkout }
  } catch (error) {
    console.error("Failed to fetch current checkout:", error)
    return { error: "Failed to fetch current checkout" }
  }
}

export async function addBook(formData: FormData) {
  const title = formData.get("title") as string
  const author = formData.get("author") as string
  const isbn = formData.get("isbn") as string
  const genre = formData.get("genre") as string
  const publishedDate = formData.get("publishedDate") as string
  const description = formData.get("description") as string

  try {
    await sql`
      INSERT INTO books (title, author, isbn, genre, published_date, description, status)
      VALUES (${title}, ${author}, ${isbn}, ${genre}, ${publishedDate || null}, ${description || null}, 'AVAILABLE')
    `

    revalidatePath("/books")
    redirect("/books")
  } catch (error) {
    console.error("Failed to add book:", error)
    return { error: "Failed to add book" }
  }
}

export async function checkoutBook(formData: FormData) {
  const bookId = formData.get("bookId") as string
  const userId = formData.get("userId") as string
  const dueDate = formData.get("dueDate") as string
  const notes = formData.get("notes") as string

  try {
    // Update book status
    await sql`
      UPDATE books
      SET status = 'CHECKED_OUT', updated_at = CURRENT_TIMESTAMP
      WHERE id = ${Number.parseInt(bookId)}
    `

    // Create checkout record
    await sql`
      INSERT INTO checkouts (book_id, user_id, due_date, notes)
      VALUES (${Number.parseInt(bookId)}, ${Number.parseInt(userId)}, ${dueDate}, ${notes || null})
    `

    revalidatePath(`/books/${bookId}`)
    revalidatePath("/books")
    redirect(`/books/${bookId}`)
  } catch (error) {
    console.error("Failed to checkout book:", error)
    return { error: "Failed to checkout book" }
  }
}

export async function returnBook(formData: FormData) {
  const bookId = formData.get("bookId") as string
  const condition = formData.get("condition") as string

  try {
    // Find the current checkout
    const [checkout] = await sql<Checkout[]>`
      SELECT * FROM checkouts
      WHERE book_id = ${Number.parseInt(bookId)}
      AND return_date IS NULL
      ORDER BY checkout_date DESC
      LIMIT 1
    `

    if (!checkout) {
      return { error: "No active checkout found for this book" }
    }

    // Update checkout with return date and condition
    await sql`
      UPDATE checkouts
      SET return_date = CURRENT_TIMESTAMP, condition = ${condition}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${checkout.id}
    `

    // Update book status
    await sql`
      UPDATE books
      SET status = 'AVAILABLE', updated_at = CURRENT_TIMESTAMP
      WHERE id = ${Number.parseInt(bookId)}
    `

    revalidatePath(`/books/${bookId}`)
    revalidatePath("/books")
    redirect(`/books/${bookId}`)
  } catch (error) {
    console.error("Failed to return book:", error)
    return { error: "Failed to return book" }
  }
}
