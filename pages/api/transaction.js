import { PrismaClient } from "@prisma/client"
import nodemailer from "nodemailer"

const prisma = new PrismaClient()

// Helper: Generate unique 10-character transaction ID
function generateTransactionId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let id = ""
  for (let i = 0; i < 10; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // change if using another provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { senderName, receiverName, receiverEmail, amount, walletId } = req.body

  if (!senderName || !receiverName || !receiverEmail || !amount || !walletId) {
    return res.status(400).json({ message: "All fields are required." })
  }

  try {
    const transactionId = generateTransactionId()

    const transaction = await prisma.transaction.create({
      data: {
        senderName,
        receiverName,
        receiverEmail,
        amount: parseFloat(amount),
        walletId: parseInt(walletId),
        transactionId,
      },
      include: { wallet: true },
    })

    // Send success email to receiver
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: receiverEmail,
      subject: "You’ve received a payment",
      html: `
        <h2>Payment Notification</h2>
        <p><strong>${senderName}</strong> sent you <strong>$${amount}</strong> using <strong>${transaction.wallet.name}</strong>.</p>
        <p>Transaction ID: <strong>${transactionId}</strong></p>
        <p>Use this ID to track or print your receipt.</p>
      `,
    })

    return res.status(200).json({ message: "Transaction created", transactionId })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Failed to create transaction" })
  }
}
