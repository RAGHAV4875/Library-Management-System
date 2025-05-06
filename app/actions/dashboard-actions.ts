"use server"

import { sql } from "@/lib/db"

export async function getDashboardStats() {
  try {
    // Get total books count
    const [totalBooksResult] = await sql`SELECT COUNT(*) as count FROM books`
    const totalBooks = totalBooksResult.count

    // Get books checked out count
    const [checkedOutBooksResult] = await sql`SELECT COUNT(*) as count FROM books WHERE status = 'CHECKED_OUT'`
    const checkedOutBooks = checkedOutBooksResult.count

    // Get active users count (users with at least one active checkout)
    const [activeUsersResult] = await sql`
      SELECT COUNT(DISTINCT user_id) as count 
      FROM checkouts 
      WHERE return_date IS NULL
    `
    const activeUsers = activeUsersResult.count

    // Get overdue books count
    const [overdueBooksResult] = await sql`
      SELECT COUNT(*) as count 
      FROM checkouts 
      WHERE return_date IS NULL AND due_date < CURRENT_TIMESTAMP
    `
    const overdueBooks = overdueBooksResult.count

    return { totalBooks, checkedOutBooks, activeUsers, overdueBooks }
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error)
    return { error: "Failed to fetch dashboard stats" }
  }
}

export async function getRecentActivities() {
  try {
    // Get recent checkouts and returns
    const recentActivities = await sql`
      SELECT c.id, c.checkout_date, c.return_date, b.title as book_title, u.name as user_name
      FROM checkouts c
      JOIN books b ON c.book_id = b.id
      JOIN users u ON c.user_id = u.id
      ORDER BY COALESCE(c.return_date, c.checkout_date) DESC
      LIMIT 5
    `

    return { recentActivities }
  } catch (error) {
    console.error("Failed to fetch recent activities:", error)
    return { error: "Failed to fetch recent activities" }
  }
}

export async function getPopularBooks() {
  try {
    // Get books with the most checkouts
    const popularBooks = await sql`
      SELECT b.id, b.title, b.author, COUNT(c.id) as checkout_count
      FROM books b
      JOIN checkouts c ON b.id = c.book_id
      GROUP BY b.id
      ORDER BY checkout_count DESC
      LIMIT 5
    `

    return { popularBooks }
  } catch (error) {
    console.error("Failed to fetch popular books:", error)
    return { error: "Failed to fetch popular books" }
  }
}
