import React, { useState } from "react"

const TrackTransaction = () => {
  const [refCode, setRefCode] = useState("")
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState("")

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setData(null)

    const res = await fetch(`/api/transaction/${refCode}`)
    const result = await res.json()

    if (res.ok) {
      setData(result.transaction)
    } else {
      setError(result.message || "Transaction not found")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Track Transaction</h2>
        <form onSubmit={handleTrack}>
          <input
            type="text"
            placeholder="Enter Reference Code"
            value={refCode}
            onChange={(e) => setRefCode(e.target.value.toUpperCase())}
            required
            className="input"
          />
          <button
            type="submit"
            className="w-full mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Track
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {data && (
          <div className="mt-6 border-t pt-4 text-sm">
            <p><strong>Sender:</strong> {data.senderName}</p>
            <p><strong>Receiver:</strong> {data.receiverName}</p>
            <p><strong>Amount:</strong> ${data.amount}</p>
            <p><strong>Status:</strong> {data.status}</p>
            <p><strong>Reference:</strong> {data.referenceCode}</p>
            <p><strong>Date:</strong> {new Date(data.createdAt).toLocaleString()}</p>
          </div>
        )}
      </div>
      <style jsx>{`
        .input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }
      `}</style>
    </div>
  )
}

export default TrackTransaction
