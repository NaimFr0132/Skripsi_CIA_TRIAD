import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/audit/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLogs(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="bg-white p-6 rounded-xl shadow">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Audit Log
          </h1>

          <button className="bg-black text-white px-4 py-2 rounded">
            Download
          </button>
        </div>

        <table className="w-full border-collapse">

          <thead>
            <tr className="bg-gray-200">

              <th className="border p-3 text-left">
                Tanggal
              </th>

              <th className="border p-3 text-left">
                Jam
              </th>

              <th className="border p-3 text-left">
                User
              </th>

              <th className="border p-3 text-left">
                Aktivitas
              </th>

              <th className="border p-3 text-left">
                IP
              </th>

            </tr>
          </thead>

          <tbody>

            {logs.map((log) => {

              const date = new Date(log.created_at);

              return (
                <tr key={log.id}>

                  <td className="border p-3">
                    {date.toLocaleDateString()}
                  </td>

                  <td className="border p-3">
                    {date.toLocaleTimeString()}
                  </td>

                  <td className="border p-3">
                    {log.username}
                  </td>

                  <td className="border p-3">
                    {log.activity}
                  </td>

                  <td className="border p-3">
                    {log.ip_address}
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>
      </div>
    </div>
  );
}

export default Dashboard;