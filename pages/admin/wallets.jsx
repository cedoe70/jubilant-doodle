import React, { useEffect, useState } from "react"

const AdminWallets = () => {
  const [wallets, setWallets] = useState([])
  const [formData, setFormData] = useState({ name: "", type: "" })

  const fetchWallets = async () => {
    const res = await fetch("/api/wallets")
    const data = await res.json()
    setWallets(data.wallets)
  }

  useEffect(() => {
    fetchWallets()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch("/api/wallets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    const data = await res.json()
    alert(data.message)
    setFormData({ name: "", type: "" })
    fetchWallets()
  }

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this wallet?")
    if (!confirm) return

    const res = await fetch(`/api/wallets/${id}`, { method: "DELETE" })
    const data = await res.json()
    alert(data.message)
    fetchWallets()
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Manage Wallets</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 max-w-md">
        <input
          type="text"
          name="name"
          placeholder="Wallet or Bank Name"
          value={formData.name}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="text"
          name="type"
          placeholder="Type (e.g. Crypto, Bank)"
          value={formData.type}
          onChange={handleChange}
          className="input"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Add Wallet
        </button>
      </form>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Wallet List</h2>
        {wallets.length === 0 ? (
          <p className="text-gray-500">No wallets found.</p>
        ) : (
          <ul className="space-y-2">
            {wallets.map((wallet) => (
              <li
                key={wallet.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <strong>{wallet.name}</strong> <span className="text-sm text-gray-600">({wallet.type})</span>
                </div>
                <button
                  onClick={() => handleDelete(wallet.id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 10px;
          margin-bottom: 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }
      `}</style>
    </div>
  )
}

export default AdminWallets
