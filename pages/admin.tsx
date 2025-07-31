import { useEffect, useState } from "react"

interface Transaction {
  id: string
  senderName: string
  receiverName: string
  receiverEmail: string
  amount: number
  referenceCode: string
  status: string
  createdAt: string
}

export default function AdminDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/transaction/all")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data.transactions)
        setLoading(false)
      })
  }, [])

  const markAsCompleted = async (ref: string) => {
    const res = await fetch("/api/transaction/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ referenceCode: ref, newStatus: "completed" }),
    })

    const result = await res.json()
    alert(result.message)

    // Refresh list
    const updated = transactions.map((tx) =>
      tx.referenceCode === ref ? { ...tx, status: "completed" } : tx
    )
    setTransactions(updated)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Transaction Dashboard</h1>
      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-200 text-left text-sm">
                <th className="p-2">Sender</th>
                <th className="p-2">Receiver</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Ref Code</th>
                <th className="p-2">Status</th>
                <th className="p-2">Date</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="text-sm border-b">
                  <td className="p-2">{tx.senderName}</td>
                  <td className="p-2">{tx.receiverName}</td>
                  <td className="p-2">${tx.amount}</td>
                  <td className="p-2">{tx.referenceCode}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        tx.status === "completed" ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-2">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    {tx.status !== "completed" && (
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
                        onClick={() => markAsCompleted(tx.referenceCode)}
                      >
                        Mark as Completed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
