"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, ChevronDown, Filter, Search, Users } from "lucide-react"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])

  const filteredUsers = users.filter((user) => {
    // Search filter
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.includes(searchQuery)

    // Status filter
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(user.status)

    return matchesSearch && matchesStatus
  })

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
              placeholder="Search users..."
              className="w-64 rounded-lg bg-background pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <BookOpen className="h-5 w-5" />
              Books
            </Link>
            <Link
              href="/users"
              className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-primary-foreground"
            >
              <Users className="h-5 w-5" />
              Users
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">User Management</h1>
            <Button asChild>
              <Link href="/users/add">Add New User</Link>
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
                      placeholder="Search by name, email, or ID..."
                      className="w-80 pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

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
                      {statuses.map((status) => (
                        <DropdownMenuCheckboxItem
                          key={status}
                          checked={selectedStatus.includes(status)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedStatus([...selectedStatus, status])
                            } else {
                              setSelectedStatus(selectedStatus.filter((s) => s !== status))
                            }
                          }}
                        >
                          {status}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="text-sm text-muted-foreground">
                  Showing {filteredUsers.length} of {users.length} users
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Books Borrowed</TableHead>
                      <TableHead>Member Since</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm">{user.email}</p>
                            <p className="text-xs text-muted-foreground">{user.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <BadgeComponent
                            variant={
                              user.status === "Active"
                                ? "success"
                                : user.status === "Suspended"
                                  ? "destructive"
                                  : "outline"
                            }
                          >
                            {user.status}
                          </BadgeComponent>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span>{user.booksBorrowed}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(user.memberSince)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/users/${user.id}`}>View</Link>
                            </Button>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
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

// Helper functions
function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Sample data
const users = [
  {
    id: "USER001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    status: "Active",
    booksBorrowed: 2,
    memberSince: "2022-01-15T10:30:00Z",
  },
  {
    id: "USER002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 987-6543",
    status: "Active",
    booksBorrowed: 1,
    memberSince: "2022-02-20T14:45:00Z",
  },
  {
    id: "USER003",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "(555) 456-7890",
    status: "Active",
    booksBorrowed: 3,
    memberSince: "2022-03-10T09:15:00Z",
  },
  {
    id: "USER004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "(555) 234-5678",
    status: "Suspended",
    booksBorrowed: 0,
    memberSince: "2022-04-05T11:30:00Z",
  },
  {
    id: "USER005",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    phone: "(555) 876-5432",
    status: "Inactive",
    booksBorrowed: 0,
    memberSince: "2022-05-12T16:20:00Z",
  },
  {
    id: "USER006",
    name: "Sarah Thompson",
    email: "sarah.thompson@example.com",
    phone: "(555) 345-6789",
    status: "Active",
    booksBorrowed: 1,
    memberSince: "2022-06-18T13:10:00Z",
  },
  {
    id: "USER007",
    name: "David Martinez",
    email: "david.martinez@example.com",
    phone: "(555) 765-4321",
    status: "Active",
    booksBorrowed: 0,
    memberSince: "2022-07-22T10:45:00Z",
  },
]

const statuses = ["Active", "Inactive", "Suspended"]

// Add Badge component variant for success
const BadgeComponent = ({ variant, children, className, ...props }: any) => {
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    success: "bg-green-100 text-green-800 hover:bg-green-200",
  }

  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.default} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
