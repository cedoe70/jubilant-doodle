// pages/api/transaction.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {
      senderName,
      receiverName,
      receiverEmail,
      amount,
      transactionId,
      referenceCode,
      walletId,
    } = req.body;

    if (!senderName || !receiverName || !receiverEmail || !amount || !transactionId || !referenceCode || !walletId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const reference = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      const transaction = await prisma.transaction.create({
        data: {
          senderName,
          receiverName,
          receiverEmail,
          amount: parseFloat(amount),
          transactionId,
          referenceCode,
          reference,
          walletId,
        },
      });

      return res.status(201).json(transaction);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong", detail: error.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }
}
