import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ref } = req.query

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { referenceCode: String(ref) },
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
