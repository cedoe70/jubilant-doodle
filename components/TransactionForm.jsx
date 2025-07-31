import React, { useEffect, useState } from "react"

const TransactionForm = () => {
  const [formData, setFormData] = useState({
    senderName: "",
    receiverName: "",
    amount: "",
    receiverEmail: "",
    walletId: "",
  })

  const [wallets, setWallets] = useState([])

  useEffect(() => {
    const fetchWallets = async () => {
      const res = await fetch("/api/wallets")
      const data = await res.json()
      setWallets(data.wallets)
    }
    fetchWallets()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await fetch("/api/transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    const data = await res.json()
    alert(data.message)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Send Money</h2>

      <input
        name="senderName"
        placeholder="Your Full Name"
        className="input"
        onChange={handleChange}
        required
      />
      <input
        name="receiverName"
        placeholder="Receiver Full Name"
        className="input"
        onChange={handleChange}
        required
      />
      <input
        name="receiverEmail"
        placeholder="Receiver Email"
        type="email"
        className="input"
        onChange={handleChange}
        required
      />
      <input
        name="amount"
        placeholder="Amount (USD)"
        type="number"
        className="input"
        onChange={handleChange}
        required
      />

      <select
        name="walletId"
        className="input"
        onChange={handleChange}
        value={formData.walletId}
        required
      >
        <option value="">Select Wallet or Bank</option>
        {wallets.map((wallet) => (
          <option key={wallet.id} value={wallet.id}>
            {wallet.name} ({wallet.type})
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded w-full"
      >
        Send
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
  )
}

export default TransactionForm
