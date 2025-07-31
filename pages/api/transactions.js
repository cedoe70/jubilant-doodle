import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        wallet: true,
      },
    })

    return res.status(200).json({ transactions })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Failed to fetch transactions." })
  }
}
