import { PrismaClient, BookStatus, UserStatus } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Clean up existing data
  await prisma.checkout.deleteMany({})
  await prisma.book.deleteMany({})
  await prisma.user.deleteMany({})

  // Create users
  const user1 = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      status: UserStatus.ACTIVE,
      memberSince: new Date("2022-01-15"),
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "(555) 987-6543",
      status: UserStatus.ACTIVE,
      memberSince: new Date("2022-02-20"),
    },
  })

  const user3 = await prisma.user.create({
    data: {
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      phone: "(555) 456-7890",
      status: UserStatus.ACTIVE,
      memberSince: new Date("2022-03-10"),
    },
  })

  const user4 = await prisma.user.create({
    data: {
      name: "Emily Davis",
      email: "emily.davis@example.com",
      phone: "(555) 234-5678",
      status: UserStatus.SUSPENDED,
      memberSince: new Date("2022-04-05"),
    },
  })

  // Create books
  const book1 = await prisma.book.create({
    data: {
      title: "The Midnight Library",
      author: "Matt Haig",
      genre: "Fiction",
      isbn: "9780525559474",
      status: BookStatus.AVAILABLE,
      publishedDate: new Date("2020-08-13"),
      description:
        "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
    },
  })

  const book2 = await prisma.book.create({
    data: {
      title: "Atomic Habits",
      author: "James Clear",
      genre: "Self-Help",
      isbn: "9780735211292",
      status: BookStatus.CHECKED_OUT,
      publishedDate: new Date("2018-10-16"),
      description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones.",
    },
  })

  const book3 = await prisma.book.create({
    data: {
      title: "Project Hail Mary",
      author: "Andy Weir",
      genre: "Science Fiction",
      isbn: "9780593135204",
      status: BookStatus.AVAILABLE,
      publishedDate: new Date("2021-05-04"),
      description: "A lone astronaut must save the earth from disaster.",
    },
  })

  const book4 = await prisma.book.create({
    data: {
      title: "The Psychology of Money",
      author: "Morgan Housel",
      genre: "Finance",
      isbn: "9780857197689",
      status: BookStatus.CHECKED_OUT,
      publishedDate: new Date("2020-09-08"),
      description: "Timeless lessons on wealth, greed, and happiness.",
    },
  })

  const book5 = await prisma.book.create({
    data: {
      title: "Educated",
      author: "Tara Westover",
      genre: "Memoir",
      isbn: "9780399590504",
      status: BookStatus.AVAILABLE,
      publishedDate: new Date("2018-02-20"),
      description:
        "A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.",
    },
  })

  // Create checkouts
  await prisma.checkout.create({
    data: {
      bookId: book2.id,
      userId: user1.id,
      checkoutDate: new Date("2023-04-15"),
      dueDate: new Date("2023-04-29"),
    },
  })

  await prisma.checkout.create({
    data: {
      bookId: book4.id,
      userId: user3.id,
      checkoutDate: new Date("2023-04-10"),
      dueDate: new Date("2023-04-24"),
    },
  })

  // Create checkout history
  await prisma.checkout.create({
    data: {
      bookId: book1.id,
      userId: user2.id,
      checkoutDate: new Date("2023-02-10"),
      dueDate: new Date("2023-02-24"),
      returnDate: new Date("2023-02-24"),
      condition: "Good",
    },
  })

  await prisma.checkout.create({
    data: {
      bookId: book1.id,
      userId: user3.id,
      checkoutDate: new Date("2023-01-05"),
      dueDate: new Date("2023-01-19"),
      returnDate: new Date("2023-01-19"),
      condition: "Excellent",
    },
  })

  await prisma.checkout.create({
    data: {
      bookId: book2.id,
      userId: user3.id,
      checkoutDate: new Date("2023-03-12"),
      dueDate: new Date("2023-03-26"),
      returnDate: new Date("2023-03-26"),
      condition: "Good",
    },
  })

  console.log("Database has been seeded!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
