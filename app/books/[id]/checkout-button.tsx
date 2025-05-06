"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { checkoutBook } from "@/app/actions/book-actions"
import { getUsers } from "@/app/actions/user-actions"
import { useEffect } from "react"

export default function CheckoutBookButton({ bookId }: { bookId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [userId, setUserId] = useState("")
  const [dueDate, setDueDate] = useState(getTwoWeeksFromNow())
  const [notes, setNotes] = useState("")
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      const { users = [] } = await getUsers()
      setUsers(users)
    }

    if (isOpen) {
      fetchUsers()
    }
  }, [isOpen])

  function getTwoWeeksFromNow() {
    const date = new Date()
    date.setDate(date.getDate() + 14)
    return date.toISOString().split("T")[0]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData()
    formData.append("bookId", bookId)
    formData.append("userId", userId)
    formData.append("dueDate", dueDate)
    formData.append("notes", notes)

    await checkoutBook(formData)
    setIsLoading(false)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Checkout Book</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Checkout Book</DialogTitle>
            <DialogDescription>Enter the user information to checkout this book</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="user">Select User</Label>
              <Select value={userId} onValueChange={setUserId} required>
                <SelectTrigger id="user">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this checkout"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : "Checkout"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
