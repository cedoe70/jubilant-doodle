// pages/api/transaction.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { nanoid } from 'nanoid'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const {
        senderName,
        receiverName,
        receiverEmail,
        amount,
        referenceCode,
        walletId,
      } = req.body

      if (
        !senderName ||
        !receiverName ||
        !receiverEmail ||
        !amount ||
        !referenceCode ||
        !walletId
      ) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const transaction = await prisma.transaction.create({
        data: {
          senderName,
          receiverName,
          receiverEmail,
          amount: parseFloat(amount),
          referenceCode,
          transactionId: nanoid(10), // auto-generate unique ID
          wallet: { connect: { id: Number(walletId) } },
        },
      })

      res.status(201).json(transaction)
    } catch (error) {
      console.error('Error creating transaction:', error)
      res.status(500).json({ error: 'Failed to create transaction' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
