import { useEffect, useState } from "react";
import axios from "axios";

function AuditLogPage() {

  const [logs, setLogs] = useState([]);

  const [selectedDate, setSelectedDate] =
    useState("");

  useEffect(() => {

    fetchLogs();

  }, [selectedDate]);

  const fetchLogs = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/audit/all?date=${selectedDate}`,
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

  const handleDownload = () => {

    window.open(
      "http://localhost:5000/api/export/audit/download",
      "_blank"
    );

  };

  return (

    <div className="bg-white p-6 rounded-xl shadow mt-10">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-3xl font-bold">
          Audit Log
        </h2>

        <button
          onClick={handleDownload}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Download Excel
        </button>

      </div>

      <div className="mb-6">

        <input
          type="date"
          value={selectedDate}
          onChange={(e) =>
            setSelectedDate(e.target.value)
          }
          className="border p-2 rounded"
        />

      </div>

      <table className="w-full border-collapse">

        <thead>

          <tr className="bg-gray-200">

            <th className="border p-3">
              User
            </th>

            <th className="border p-3">
              Aktivitas
            </th>

            <th className="border p-3">
              IP
            </th>

            <th className="border p-3">
              Waktu
            </th>

          </tr>

        </thead>

        <tbody>

          {logs.map((log) => (

            <tr key={log.id}>

              <td className="border p-3">
                {log.username}
              </td>

              <td className="border p-3">
                {log.activity}
              </td>

              <td className="border p-3">
                {log.ip_address}
              </td>

              <td className="border p-3">
                {new Date(
                  log.created_at
                ).toLocaleString()}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}

export default AuditLogPage;