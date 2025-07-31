// pages/api/transaction/[ref].ts

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ref } = req.query;

  if (typeof ref !== "string") {
    return res.status(400).json({ error: "Invalid reference format" });
  }

  try {
    // This assumes your schema.prisma has: reference String @unique
    const transaction = await prisma.transaction.findUnique({
      where: { reference: ref }, // ✅ Use the correct unique field
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
