import React, { useEffect, useState } from "react"

const AdminWallets = () => {
  const [wallets, setWallets] = useState([])
  const [name, setName] = useState("")
  const [type, setType] = useState("bank") // Default to 'bank'

  const fetchWallets = async () => {
    const res = await fetch("/api/wallets")
    const data = await res.json()
    setWallets(data.wallets)
  }

  useEffect(() => {
    fetchWallets()
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!name || !type) return alert("Please fill all fields")

    const res = await fetch("/api/wallets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type }),
    })

    const data = await res.json()
    alert(data.message)
    setName("")
    setType("bank")
    fetchWallets()
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return
    await fetch(`/api/wallets/${id}`, { method: "DELETE" })
    fetchWallets()
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Manage Wallets / Banks</h2>
      <form onSubmit={handleAdd} className="flex flex-col gap-4 mb-6">
        <input
          type="text"
          placeholder="Wallet or Bank Name (e.g. Trust Wallet)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="bank">Bank</option>
          <option value="crypto">Crypto Wallet</option>
          <option value="cash">Cash Pickup</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Wallet / Bank
        </button>
      </form>

      <ul className="space-y-3">
        {wallets.map((wallet) => (
          <li
            key={wallet.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{wallet.name}</p>
              <p className="text-sm text-gray-500 capitalize">
                Type: {wallet.type}
              </p>
            </div>
            <button
              onClick={() => handleDelete(wallet.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminWallets
