import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { transactionId } = req.query

  if (!transactionId) {
    return res.status(400).json({ message: "Transaction ID is required" })
  }

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { transactionId },
      include: { wallet: true },
    })

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    res.status(200).json({ transaction })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}
