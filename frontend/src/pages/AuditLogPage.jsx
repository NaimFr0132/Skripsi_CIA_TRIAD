import { useEffect, useState } from "react";

import axios from "axios";

function AuditLogPage() {
  const [logs, setLogs] = useState([]);

  const [selectedDate, setSelectedDate] = useState("");

  const [search, setSearch] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, [selectedDate]);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/audit/all?date=${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setLogs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/export/audit/download",

        {
          responseType: "blob",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute("download", "audit_logs.xlsx");

      document.body.appendChild(link);

      link.click();

      link.remove();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredLogs = logs.filter((log) => {
    return (
      log.username?.toLowerCase().includes(search.toLowerCase()) ||
      log.description?.toLowerCase().includes(search.toLowerCase()) ||
      log.action?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-600";

      case "high":
        return "bg-orange-100 text-orange-600";

      case "medium":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-green-100 text-green-600";
    }
  };

  const getActionDotColor = (action) => {
    if (!action) return "bg-slate-400";

    if (action.includes("DELETE")) {
      return "bg-red-500";
    }

    if (action.includes("FAILED")) {
      return "bg-orange-500";
    }

    if (action.includes("APPROVED")) {
      return "bg-blue-500";
    }

    if (action.includes("SUCCESS")) {
      return "bg-green-500";
    }

    return "bg-slate-400";
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Audit Log</h1>

          <p className="text-slate-500 mt-2">
            Monitoring aktivitas dan keamanan sistem
          </p>
        </div>

        <button
          onClick={handleDownload}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl transition-all duration-200 font-medium"
        >
          Download Excel
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Cari aktivitas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-slate-200 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 flex-1"
        />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-slate-200 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left p-5 text-slate-500 font-semibold">
                User
              </th>

              <th className="text-left p-5 text-slate-500 font-semibold">
                Role
              </th>

              <th className="text-left p-5 text-slate-500 font-semibold">
                Action
              </th>

              <th className="text-left p-5 text-slate-500 font-semibold">
                Severity
              </th>

              <th className="text-left p-5 text-slate-500 font-semibold">IP</th>

              <th className="text-left p-5 text-slate-500 font-semibold">
                Foto
              </th>

              <th className="text-left p-5 text-slate-500 font-semibold">
                Waktu
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredLogs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition-all duration-200"
              >
                <td className="p-5 font-medium text-slate-800">
                  {log.username || "-"}
                </td>

                <td className="p-5">
                  <span
                    className={
                      log.role === "superadmin"
                        ? "bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm"
                        : log.role === "admin"
                          ? "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm"
                          : "bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
                    }
                  >
                    {log.role || "-"}
                  </span>
                </td>

                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${getActionDotColor(log.action)}`}
                    />

                    <div>
                      <p className="font-medium text-slate-700">{log.action}</p>

                      <p className="text-sm text-slate-400 mt-1">
                        {log.description}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="p-5">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getSeverityColor(log.severity)}`}
                  >
                    {log.severity}
                  </span>
                </td>

                <td className="p-5 text-slate-500">{log.ip_address || "-"}</td>

                <td className="p-5">
                  {log.snapshot_image ? (
                    <button
                      onClick={() =>
                        setSelectedImage(
                          `http://localhost:5000/${log.snapshot_image}`,
                        )
                      }
                      className="bg-blue-100 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-200 transition-all duration-200"
                    >
                      Lihat Foto
                    </button>
                  ) : (
                    <span className="text-slate-400">Tidak ada</span>
                  )}
                </td>

                <td className="p-5 text-slate-500">
                  {new Date(log.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl max-w-3xl w-full relative shadow-2xl">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-full"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Foto Audit
            </h2>

            <img
              src={selectedImage}
              alt="Audit"
              className="w-full rounded-2xl border border-slate-200"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AuditLogPage;
