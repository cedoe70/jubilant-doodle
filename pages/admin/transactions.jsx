import React, { useEffect, useState } from "react"

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await fetch("/api/transactions")
      const data = await res.json()
      setTransactions(data.transactions)
    }

    fetchTransactions()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Transactions</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Sender</th>
              <th className="p-3 border">Receiver</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Amount (USD)</th>
              <th className="p-3 border">Wallet/Bank</th>
              <th className="p-3 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="p-3 border">{tx.senderName}</td>
                <td className="p-3 border">{tx.receiverName}</td>
                <td className="p-3 border">{tx.receiverEmail}</td>
                <td className="p-3 border">${tx.amount}</td>
                <td className="p-3 border">
                  {tx.wallet?.name} ({tx.wallet?.type})
                </td>
                <td className="p-3 border">
                  {new Date(tx.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TransactionsPage
