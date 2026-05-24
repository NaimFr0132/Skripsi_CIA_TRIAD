import { useEffect, useState } from "react";
import axios from "axios";
import AuditLogPage from "./AuditLogPage";

function SuperAdminDashboard() {
  const [page, setPage] = useState("dashboard");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLogsToday: 0,
    totalAdmins: 0,
  });

  const [logs, setLogs] = useState([]);

  const [users, setUsers] = useState([]);
  const username = localStorage.getItem("username");
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/dashboard/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setStats(res.data);

        const logRes = await axios.get("http://localhost:5000/api/audit/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLogs(logRes.data.slice(0, 5));

        const userRes = await axios.get("http://localhost:5000/api/users/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(userRes.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="w-64 bg-black text-white p-6">
        <h1 className="text-2xl font-bold mb-10">{username}</h1>

        <ul className="space-y-4">
          <li
            onClick={() => setPage("dashboard")}
            className="bg-gray-800 p-3 rounded cursor-pointer"
          >
            Dashboard
          </li>

          <li
            onClick={() => setPage("audit")}
            className="hover:bg-gray-800 p-3 rounded cursor-pointer"
          >
            Audit Log
          </li>

          <li className="hover:bg-gray-800 p-3 rounded cursor-pointer">
            Kelola Admin
          </li>

          <li className="hover:bg-gray-800 p-3 rounded cursor-pointer">
            Download Report
          </li>

          <li
            onClick={() => {
              localStorage.clear();

              window.location.reload();
            }}
            className="hover:bg-red-700 bg-red-600 p-3 rounded cursor-pointer"
          >
            Logout
          </li>
        </ul>
      </div>

      <div className="flex-1 p-10">
        {page === "dashboard" && (
          <>
            <h1 className="text-4xl font-bold mb-8">Dashboard Superadmin</h1>

            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-bold mb-2">Total User</h2>

                <p className="text-4xl font-bold">{stats.totalUsers}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-bold mb-2">Audit Log Hari Ini</h2>

                <p className="text-4xl font-bold">{stats.totalLogsToday}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-bold mb-2">Admin Aktif</h2>

                <p className="text-4xl font-bold">{stats.totalAdmins}</p>
              </div>
            </div>

            <div className="bg-white mt-10 p-6 rounded-xl shadow">
              <h2 className="text-2xl font-bold mb-6">Aktivitas Terbaru</h2>

              <div className="space-y-4">
                {logs.map((log) => {
                  const date = new Date(log.created_at);

                  return (
                    <div key={log.id} className="border p-4 rounded-lg">
                      <p className="font-bold">{log.username}</p>

                      <p>{log.activity}</p>

                      <p className="text-sm text-gray-500">
                        {date.toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white mt-10 p-6 rounded-xl shadow">
              <h2 className="text-2xl font-bold mb-6">Daftar User</h2>

              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 border">ID</th>

                    <th className="p-3 border">Username</th>

                    <th className="p-3 border">Role</th>

                    <th className="p-3 border">Email</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="p-3 border">{user.id}</td>

                      <td className="p-3 border">{user.username}</td>

                      <td className="p-3 border">{user.role}</td>

                      <td className="p-3 border">{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {page === "audit" && <AuditLogPage />}
      </div>
    </div>
  );
  <button
  onClick={() => {

    localStorage.clear();

    window.location.reload();

  }}
  className="bg-gray-700 text-white px-4 py-2 rounded"
>
  Kembali ke Login
</button>
}

export default SuperAdminDashboard;
