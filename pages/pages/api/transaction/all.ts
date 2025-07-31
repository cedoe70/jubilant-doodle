import { prisma } from "../../../lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end()

  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
    })

    return res.status(200).json({ transactions })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}
