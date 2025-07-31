// pages/api/transaction.ts

import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      senderName,
      receiverName,
      receiverEmail,
      amount,
      transactionId,
      referenceCode,
      walletId,
    } = req.body;

    if (
      !senderName ||
      !receiverName ||
      !receiverEmail ||
      !amount ||
      !transactionId ||
      !referenceCode ||
      !walletId
    ) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
      const transaction = await prisma.transaction.create({
        data: {
          senderName,
          receiverName,
          receiverEmail,
          amount: parseFloat(amount),
          transactionId,
          referenceCode,
          walletId,
        },
      });

      return res.status(200).json({ message: 'Transaction created', transaction });
    } catch (error) {
      console.error('Transaction creation error:', error);
      return res.status(500).json({ message: 'Server error', error });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
