import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { email } = req.query

  if (!email) {
    return res.status(400).json({ message: "Email is required." })
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        receiverEmail: email,
      },
      orderBy: { createdAt: "desc" },
      include: {
        wallet: true,
      },
    })

    return res.status(200).json({ transactions })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Error fetching transactions." })
  }
}
