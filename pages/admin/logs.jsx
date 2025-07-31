import React, { useEffect, useState } from "react"

const AdminLogs = () => {
  const [logs, setLogs] = useState([])

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/logs")
      const data = await res.json()
      setLogs(data.logs)
    } catch (error) {
      console.error("Failed to fetch logs", error)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">System Logs</h1>

      {logs.length === 0 ? (
        <div className="text-center text-gray-600">No logs available.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">#</th>
                <th className="p-3">Message</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
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
