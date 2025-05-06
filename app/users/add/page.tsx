"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function AddUserPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    membershipType: "",
    receiveNotifications: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, receiveNotifications: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the user to your database
    console.log("User data:", formData)
    // Redirect to users page after successful submission
    // router.push("/users")
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
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <BookOpen className="h-5 w-5" />
              Books
            </Link>
            <Link
              href="/users"
              className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-primary-foreground"
            >
              <BookOpen className="h-5 w-5" />
              Users
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <Button variant="outline" size="sm" asChild className="mb-6">
              <Link href="/users">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Users
              </Link>
            </Button>

            <h1 className="text-2xl font-semibold">Add New User</h1>
            <p className="text-muted-foreground">Enter the details of the new library member.</p>
          </div>

          <Card className="max-w-2xl">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
                <CardDescription>Fill in the user details. All fields marked with * are required.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="membershipType">Membership Type *</Label>
                    <Select
                      value={formData.membershipType}
                      onValueChange={(value) => handleSelectChange("membershipType", value)}
                    >
                      <SelectTrigger id="membershipType">
                        <SelectValue placeholder="Select membership type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="receiveNotifications"
                    checked={formData.receiveNotifications}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="receiveNotifications">
                    Receive email notifications about due dates and library events
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" asChild>
                  <Link href="/users">Cancel</Link>
                </Button>
                <Button type="submit">Add User</Button>
              </CardFooter>
            </form>
          </Card>
        </main>
      </div>
    </div>
  )
}
