import React, { useState } from "react"

const TrackTransaction = () => {
  const [email, setEmail] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleTrack = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResults([])

    try {
      const res = await fetch(`/api/track?email=${encodeURIComponent(email)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Something went wrong")

      setResults(data.transactions)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Track a Transaction</h2>
        <form onSubmit={handleTrack}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded mb-4"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Searching..." : "Track"}
          </button>
        </form>

        {error && <p className="mt-4 text-red-600">{error}</p>}

        {results.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Results:</h3>
            <ul className="space-y-3">
              {results.map((tx) => (
                <li key={tx.id} className="border p-4 rounded">
                  <p>
                    <strong>From:</strong> {tx.senderName}
                  </p>
                  <p>
                    <strong>Amount:</strong> ${tx.amount}
                  </p>
                  <p>
                    <strong>Wallet/Bank:</strong> {tx.wallet.name} ({tx.wallet.type})
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(tx.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrackTransaction
