import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === "GET") {
    const wallets = await prisma.wallet.findMany({
      orderBy: { createdAt: "desc" },
    })
    return res.status(200).json({ wallets })
  }

  if (req.method === "POST") {
    const { name, type } = req.body

    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required." })
    }

    const wallet = await prisma.wallet.create({
      data: {
        name,
        type,
      },
    })

    return res.status(201).json({ wallet, message: "Wallet created successfully." })
  }

  return res.status(405).json({ message: "Method not allowed" })
}
