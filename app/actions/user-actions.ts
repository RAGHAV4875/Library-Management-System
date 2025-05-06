"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { sql, type User, type UserStatus } from "@/lib/db"

export async function getUsers() {
  try {
    const users = await sql<User[]>`
      SELECT * FROM users
      ORDER BY name ASC
    `
    return { users }
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return { error: "Failed to fetch users" }
  }
}

export async function getUserById(id: string) {
  try {
    const [user] = await sql<User[]>`
      SELECT * FROM users
      WHERE id = ${Number.parseInt(id)}
    `

    if (!user) {
      return { error: "User not found" }
    }

    return { user }
  } catch (error) {
    console.error("Failed to fetch user:", error)
    return { error: "Failed to fetch user" }
  }
}

export async function getUserCheckouts(userId: string) {
  try {
    // Get active checkouts
    const activeCheckouts = await sql`
      SELECT c.*, b.title as book_title, b.author as book_author
      FROM checkouts c
      JOIN books b ON c.book_id = b.id
      WHERE c.user_id = ${Number.parseInt(userId)}
      AND c.return_date IS NULL
      ORDER BY c.checkout_date DESC
    `

    // Get checkout history
    const checkoutHistory = await sql`
      SELECT c.*, b.title as book_title, b.author as book_author
      FROM checkouts c
      JOIN books b ON c.book_id = b.id
      WHERE c.user_id = ${Number.parseInt(userId)}
      AND c.return_date IS NOT NULL
      ORDER BY c.checkout_date DESC
    `

    return { activeCheckouts, checkoutHistory }
  } catch (error) {
    console.error("Failed to fetch user checkouts:", error)
    return { error: "Failed to fetch user checkouts" }
  }
}

export async function addUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string

  try {
    await sql`
      INSERT INTO users (name, email, phone, address, status)
      VALUES (${name}, ${email}, ${phone || null}, ${address || null}, 'ACTIVE')
    `

    revalidatePath("/users")
    redirect("/users")
  } catch (error) {
    console.error("Failed to add user:", error)
    return { error: "Failed to add user" }
  }
}

export async function updateUserStatus(userId: string, status: UserStatus) {
  try {
    await sql`
      UPDATE users
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${Number.parseInt(userId)}
    `

    revalidatePath(`/users/${userId}`)
    revalidatePath("/users")
    return { success: true }
  } catch (error) {
    console.error("Failed to update user status:", error)
    return { error: "Failed to update user status" }
  }
}

export async function getUsersWithBorrowedBooks() {
  try {
    const users = await sql`
      SELECT u.*, COUNT(c.id) as books_borrowed
      FROM users u
      LEFT JOIN checkouts c ON u.id = c.user_id AND c.return_date IS NULL
      GROUP BY u.id
      ORDER BY u.name ASC
    `
    return { users }
  } catch (error) {
    console.error("Failed to fetch users with borrowed books:", error)
    return { error: "Failed to fetch users with borrowed books" }
  }
}
