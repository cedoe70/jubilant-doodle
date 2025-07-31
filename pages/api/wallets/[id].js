import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === "DELETE") {
    try {
      await prisma.wallet.delete({
        where: { id },
      })
      return res.status(200).json({ message: "Wallet deleted successfully." })
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete wallet." })
    }
  }

  return res.status(405).json({ message: "Method not allowed" })
}
