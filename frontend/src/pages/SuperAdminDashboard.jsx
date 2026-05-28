import { useEffect, useState } from "react";

import axios from "axios";

import AuditLogPage from "./AuditLogPage";

import Sidebar from "../components/Sidebar";

import StatsCard from "../components/StatsCard";

import RecentActivity from "../components/RecentActivity";

import UserTable from "../components/UserTable";

import AdminManagement from "../components/AdminManagement";

import PKLPartnerManagement from "./superadmin/PKLPartnerManagement";

import StudentManagement from "../components/StudentManagement";

function SuperAdminDashboard() {
  const [page, setPage] = useState("dashboard");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLogsToday: 0,
    totalAdmins: 0,
  });

  const [logs, setLogs] = useState([]);

  const [users, setUsers] = useState([]);

  const [admins, setAdmins] = useState([]);

  const username = localStorage.getItem("username");

  const [newAdmin, setNewAdmin] = useState({
    username: "",
    password: "",
    email: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const statsRes = await axios.get(
        "http://localhost:5000/api/dashboard/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setStats(statsRes.data);

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

      setAdmins(userRes.data.filter((user) => user.role === "admin"));
    } catch (error) {
      console.log(error);
    }
  };

  const createAdmin = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/users/create-admin",
        newAdmin,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Admin berhasil dibuat");

      fetchData();

      setNewAdmin({
        username: "",
        password: "",
        email: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAdmin = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/users/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Admin berhasil dihapus");

      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleUserStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/users/toggle-active/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar page={page} setPage={setPage} username={username} />

      <div className="flex-1 bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 h-screen overflow-y-auto">
        <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-10 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              School Security System
            </h1>

            <p className="text-slate-500 mt-1">
              Monitoring dan audit keamanan sekolah
            </p>
          </div>

          <div className="bg-slate-100 px-5 py-3 rounded-2xl">
            <p className="text-slate-500 text-sm">Status</p>

            <p className="font-semibold text-green-600">System Active</p>
          </div>
        </div>

        <div className="p-10 pt-14">
          {page === "dashboard" && (
            <>
              <h1 className="text-4xl font-bold text-slate-800 mb-8">
                Dashboard Superadmin
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard title="Total User" value={stats.totalUsers} />

                <StatsCard
                  title="Audit Hari Ini"
                  value={stats.totalLogsToday}
                />

                <StatsCard title="Admin Aktif" value={stats.totalAdmins} />
              </div>

              <RecentActivity logs={logs} />

              <UserTable users={users} />
            </>
          )}

          {page === "admin-management" && (
            <AdminManagement
              admins={admins}
              newAdmin={newAdmin}
              setNewAdmin={setNewAdmin}
              createAdmin={createAdmin}
              deleteAdmin={deleteAdmin}
              toggleUserStatus={toggleUserStatus}
            />
          )}

          {page === "student-management" && <StudentManagement />}

          {page === "pkl-partner" && <PKLPartnerManagement />}

          {page === "audit" && <AuditLogPage />}
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
