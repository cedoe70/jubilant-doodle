import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const {
        senderName,
        receiverName,
        receiverEmail,
        amount,
        transactionId,
        referenceCode,
        walletId,
      } = req.body;

      const transaction = await prisma.transaction.create({
        data: {
          senderName,
          receiverName,
          receiverEmail,
          amount,
          transactionId,
          referenceCode,
          walletId,
        },
      });

      res.status(201).json({ success: true, transaction });
    } catch (error: any) {
      console.error("Error creating transaction:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
