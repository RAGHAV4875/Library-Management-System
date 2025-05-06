import { neon } from "@neondatabase/serverless"

// Create a SQL client with the connection string from environment variables
export const sql = neon(process.env.DATABASE_URL!)

// Book status types
export type BookStatus = "AVAILABLE" | "CHECKED_OUT" | "ON_HOLD"

// User status types
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED"

// Type definitions for our database models
export type Book = {
  id: number
  title: string
  author: string
  isbn: string
  genre: string
  published_date: string | null
  description: string | null
  status: BookStatus
  created_at: string
  updated_at: string
}

export type User = {
  id: number
  name: string
  email: string
  phone: string | null
  address: string | null
  status: UserStatus
  member_since: string
  updated_at: string
}

export type Checkout = {
  id: number
  book_id: number
  user_id: number
  checkout_date: string
  due_date: string
  return_date: string | null
  condition: string | null
  notes: string | null
  created_at: string
  updated_at: string
}
