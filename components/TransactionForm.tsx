import React, { useState } from "react"

const TransactionForm = () => {
  const [formData, setFormData] = useState({
    senderName: "",
    receiverName: "",
    amount: "",
    receiverEmail: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
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
      <button
        type="submit"
        className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded w-full"
      >
        Send
      </button>

      <p className="mt-4 text-center text-sm">
        <a href="/track" className="text-blue-600 underline">
          Track a transaction
        </a>
      </p>

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
