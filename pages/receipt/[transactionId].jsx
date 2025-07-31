import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const ReceiptPage = () => {
  const router = useRouter()
  const { transactionId } = router.query

  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (transactionId) {
      fetch(`/api/track?transactionId=${transactionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.transaction) {
            setTransaction(data.transaction)
          } else {
            setError("Transaction not found.")
          }
          setLoading(false)
        })
        .catch(() => {
          setError("Failed to fetch transaction.")
          setLoading(false)
        })
    }
  }, [transactionId])

  const handlePrint = () => {
    window.print()
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded mt-10">
      <h1 className="text-2xl font-bold text-center mb-4">Transaction Receipt</h1>
      <div className="space-y-2 text-sm print:text-base">
        <p><strong>Transaction ID:</strong> {transaction.transactionId}</p>
        <p><strong>Date:</strong> {new Date(transaction.createdAt).toLocaleString()}</p>
        <p><strong>Sender:</strong> {transaction.senderName}</p>
        <p><strong>Receiver:</strong> {transaction.receiverName}</p>
        <p><strong>Email:</strong> {transaction.receiverEmail}</p>
        <p><strong>Wallet:</strong> {transaction.wallet.name}</p>
        <p><strong>Amount:</strong> ${transaction.amount}</p>
      </div>

      <div className="mt-6 flex justify-center print:hidden">
        <button
          onClick={handlePrint}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Download / Print Receipt
        </button>
      </div>

      <style jsx global>{`
        @media print {
          button, .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}

export default ReceiptPage
