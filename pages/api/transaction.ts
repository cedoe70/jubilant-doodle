import { prisma } from "../../lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

function generateReference() {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const { senderName, receiverName, receiverEmail, amount } = req.body

  try {
    const referenceCode = generateReference()

    const transaction = await prisma.transaction.create({
      data: {
        senderName,
        receiverName,
        receiverEmail,
        amount: parseFloat(amount),
        referenceCode,
      },
    })

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: receiverEmail,
      subject: "You've Received a New Transfer",
      html: `
        <h2>New Money Transfer</h2>
        <p><strong>From:</strong> ${senderName}</p>
        <p><strong>To:</strong> ${receiverName}</p>
        <p><strong>Amount:</strong> $${amount}</p>
        <p><strong>Reference Code:</strong> ${referenceCode}</p>
        <p>Status: Pending</p>
      `,
    })

    return res.status(200).json({ message: "Transaction created & email sent" })
  } catch (error) {
    console.error("Error:", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}
