import { PrismaClient } from "@prisma/client"
import nodemailer from "nodemailer"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { senderName, receiverName, receiverEmail, amount, walletId } = req.body

  if (!senderName || !receiverName || !receiverEmail || !amount || !walletId) {
    return res.status(400).json({ message: "All fields are required." })
  }

  try {
    // Fetch the selected wallet/bank
    const wallet = await prisma.wallet.findUnique({ where: { id: walletId } })
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found." })
    }

    // Save transaction to database
    await prisma.transaction.create({
      data: {
        senderName,
        receiverName,
        receiverEmail,
        amount: parseFloat(amount),
        walletId,
      },
    })

    // Send notification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: `"Money Transfer" <${process.env.EMAIL_USER}>`,
      to: receiverEmail,
      subject: "You Have Received a Transfer",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>You've received a transfer!</h2>
          <p><strong>From:</strong> ${senderName}</p>
          <p><strong>Amount:</strong> $${amount}</p>
          <p><strong>Wallet/Bank:</strong> ${wallet.name} (${wallet.type})</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <p style="margin-top: 20px;">Please check your ${wallet.type} account for the transfer.</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)

    return res.status(200).json({ message: "Transaction sent and email delivered." })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Something went wrong." })
  }
}
