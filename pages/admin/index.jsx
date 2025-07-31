import Link from "next/link"

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link href="/admin/wallets" className="card">
            <div>
              <h2 className="text-xl font-semibold mb-2">Wallets</h2>
              <p>Manage supported banks and wallets</p>
            </div>
          </Link>

          <Link href="/admin/transactions" className="card">
            <div>
              <h2 className="text-xl font-semibold mb-2">Transactions</h2>
              <p>View all user transactions</p>
            </div>
          </Link>

          <Link href="/admin/logs" className="card">
            <div>
              <h2 className="text-xl font-semibold mb-2">Logs</h2>
              <p>Activity logs (coming soon)</p>
            </div>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .card {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        }
        .card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  )
}

export default AdminDashboard
