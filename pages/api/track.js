import React, { useState } from "react"

const TrackTransaction = () => {
  const [transactionId, setTransactionId] = useState("")
  const [transaction, setTransaction] = useState(null)
  const [error, setError] = useState("")

  const handleTrack = async (e) => {
    e.preventDefault()
    setError("")
    setTransaction(null)

    try {
      const res = await fetch(`/api/track?transactionId=${transactionId}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message)
      }

      setTransaction(data.transaction)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <form
        onSubmit={handleTrack}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Track Transaction
        </h2>
        <input
          type="text"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          placeholder="Enter Transaction ID"
          className="input"
          required
        />
        <button
          type="submit"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
        >
          Track
        </button>
        <style jsx>{`
          .input {
            width: 100%;
            padding: 10px;
            margin-bottom: 12px;
            border: 1px solid #ccc;
            border-radius: 6px;
          }
        `}</style>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {transaction && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
          <h3 className="text-xl font-semibold mb-2 text-center">
            Transaction Details
          </h3>
          <ul className="space-y-2">
            <li>
              <strong>Sender:</strong> {transaction.senderName}
            </li>
            <li>
              <strong>Receiver:</strong> {transaction.receiverName}
            </li>
            <li>
              <strong>Email:</strong> {transaction.receiverEmail}
            </li>
            <li>
              <strong>Wallet:</strong> {transaction.wallet.name}
            </li>
            <li>
              <strong>Amount:</strong> ${transaction.amount}
            </li>
            <li>
              <strong>Transaction ID:</strong> {transaction.transactionId}
            </li>
            <li>
              <strong>Date:</strong>{" "}
              {new Date(transaction.createdAt).toLocaleString()}
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default TrackTransaction
