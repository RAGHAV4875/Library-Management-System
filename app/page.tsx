import Link from "next/link"
import { BookOpen, Users, BarChart2, Settings, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDashboardStats, getRecentActivities, getPopularBooks } from "./actions/dashboard-actions"

export default async function Dashboard() {
  const { totalBooks = 0, checkedOutBooks = 0, activeUsers = 0, overdueBooks = 0 } = await getDashboardStats()
  const { recentActivities = [] } = await getRecentActivities()
  const { popularBooks = [] } = await getPopularBooks()

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
            <Input type="search" placeholder="Search books..." className="w-64 rounded-lg bg-background pl-8" />
          </form>
          <Button variant="outline" size="sm" asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-muted/40">
          <nav className="grid gap-2 p-4">
            <Link href="/" className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-primary-foreground">
              <BarChart2 className="h-5 w-5" />
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
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Users className="h-5 w-5" />
              Users
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <Button asChild>
              <Link href="/books/add">Add New Book</Link>
            </Button>
          </div>
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalBooks}</div>
                    <p className="text-xs text-muted-foreground">+12 added this month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Books Checked Out</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{checkedOutBooks}</div>
                    <p className="text-xs text-muted-foreground">+8% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{activeUsers}</div>
                    <p className="text-xs text-muted-foreground">+24 new registrations</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overdueBooks}</div>
                    <p className="text-xs text-muted-foreground">-3 from last week</p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>Latest transactions in the library system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-4">
                          <div className={`rounded-full p-2 ${activity.return_date ? "bg-blue-100" : "bg-green-100"}`}>
                            <BookOpen
                              className={`h-4 w-4 ${activity.return_date ? "text-blue-600" : "text-green-600"}`}
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {activity.user_name} {activity.return_date ? "returned" : "checked out"}{" "}
                              <span className="font-semibold">{activity.book_title}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.return_date || activity.checkout_date).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Popular Books</CardTitle>
                    <CardDescription>Most checked out books this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {popularBooks.map((book, index) => (
                        <div key={book.id} className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded bg-muted/60 flex items-center justify-center">
                            <span className="font-semibold text-sm">{index + 1}</span>
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{book.title}</p>
                            <p className="text-xs text-muted-foreground">{book.author}</p>
                          </div>
                          <div className="text-sm text-muted-foreground">{book.checkout_count} checkouts</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>View detailed library analytics and statistics</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">Analytics charts will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                  <CardDescription>Generate and view library reports</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">Report generation tools will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
