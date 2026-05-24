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

  const handleDownload = () => {
    window.open("http://localhost:5000/api/export/audit/download", "_blank");
  };

  const filteredLogs = logs.filter((log) => {
    return (
      log.username?.toLowerCase().includes(search.toLowerCase()) ||
      log.activity?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Audit Log</h1>

          <p className="text-slate-500 mt-2">Monitoring aktivitas sistem</p>
        </div>

        <button
          onClick={handleDownload}
          className="bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] text-white px-6 py-4 rounded-2xl transition-all duration-200 font-medium"
        >
          Download Excel
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Cari username atau aktivitas..."
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
            <tr className="bg-slate-100 sticky top-0 z-10">
              <th className="text-left p-5 text-slate-500 font-semibold">
                User
              </th>

              <th className="text-left p-5 text-slate-500 font-semibold">
                Role
              </th>

              <th className="text-left p-5 text-slate-500 font-semibold">
                Aktivitas
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
                  {log.username}
                </td>

                <td className="p-5">
                  <span
                    className={
                      log.role === "superadmin"
                        ? "bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm"
                        : log.role === "admin1"
                          ? "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm"
                          : "bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
                    }
                  >
                    {log.role}
                  </span>
                </td>

                <td className="p-5 text-slate-700">{log.activity}</td>

                <td className="p-5 text-slate-500">{log.ip_address}</td>

                <td className="p-5">
                  {log.image_path ? (
                    <button
                      onClick={() =>
                        setSelectedImage(
                          `http://127.0.0.1:8000/${log.image_path}`,
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
        {selectedImage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-3xl max-w-3xl w-full relative shadow-2xl animate-[fadeIn_.2s_ease-in-out]">
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
    </div>
  );
}

export default AuditLogPage;
