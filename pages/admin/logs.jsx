import React, { useEffect, useState } from "react"

const AdminLogs = () => {
  const [logs, setLogs] = useState([])

  const fetchLogs = async () => {
    const res = await fetch("/api/logs")
    const data = await res.json()
    setLogs(data.logs)
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">System Logs</h1>

      {logs.length === 0 ? (
        <p className="text-gray-500">No logs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded shadow-md">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">ID</th>
                <th className="p-3">Message</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{log.id}</td>
                  <td className="p-3">{log.message}</td>
                  <td className="p-3">
                    {new Date(log.createdAt).toLocaleString()}
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

export default AdminLogs
