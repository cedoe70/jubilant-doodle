import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../lib/prisma"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const { referenceCode, newStatus, reason } = req.body

  try {
    const transaction = await prisma.transaction.update({
      where: { referenceCode },
      data: { status: newStatus },
    })

    if (newStatus === "completed") {
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: transaction.receiverEmail,
        subject: "Funds Ready for Pickup",
        html: `
          <h2>Good News, ${transaction.receiverName}!</h2>
          <p>Your money transfer from <strong>${transaction.senderName}</strong> is now <strong>ready for pickup</strong>.</p>
          <p><strong>Amount:</strong> $${transaction.amount}</p>
          <p><strong>Reference Code:</strong> ${transaction.referenceCode}</p>
          <p>Status: <strong>Completed</strong></p>
          <p>Thank you for using our service.</p>
        `,
      })
    }

    if (newStatus === "rejected") {
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: transaction.receiverEmail,
        subject: "Transaction Rejected",
        html: `
          <h2>Hello ${transaction.receiverName},</h2>
          <p>We're sorry to inform you that the money transfer from <strong>${transaction.senderName}</strong> has been <span style="color: red;"><strong>rejected</strong></span>.</p>
          <p><strong>Reference Code:</strong> ${transaction.referenceCode}</p>
          <p><strong>Status:</strong> Rejected</p>
          ${
            reason
              ? `<p><strong>Reason:</strong> ${reason}</p>`
              : ""
          }
          <p>If you have questions, please contact our support team.</p>
        `,
      })
    }

    return res.status(200).json({ message: "Transaction status updated" })
  } catch (error) {
    console.error("Error updating transaction:", error)
    return res.status(500).json({ message: "Error updating transaction" })
  }
}
