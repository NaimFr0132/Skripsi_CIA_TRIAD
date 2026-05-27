import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  FileText,
  LogOut,
} from "lucide-react";

import PengajuanPKL from "./PengajuanPKL";

function UserDashboard() {
  const [page, setPage] = useState("dashboard");

  const [statusPKL, setStatusPKL] = useState("Belum Mengajukan");

  const username = localStorage.getItem("username");

  const fetchStatus = async () => {
    try {
      const username = localStorage.getItem("username");

      const res = await axios.get(
        `http://localhost:5000/api/pkl-request/student/${username}`,
      );

      if (res.data.length > 0) {
        setStatusPKL(res.data[0].status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <div className="w-72 h-screen sticky top-0 bg-white border-r border-slate-200 p-6 flex flex-col justify-between">
        <div>
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-slate-800">{username}</h1>

            <p className="text-slate-500 mt-1">Student Workspace</p>
          </div>

          <ul className="space-y-3">
            <li
              onClick={() => setPage("dashboard")}
              className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 font-medium ${
                page === "dashboard"
                  ? "bg-blue-600 text-white shadow-md scale-[1.02]"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard size={20} />

                <span>Dashboard</span>
              </div>
            </li>

            <li
              onClick={() => setPage("pkl")}
              className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 font-medium ${
                page === "pkl"
                  ? "bg-blue-600 text-white shadow-md scale-[1.02]"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase size={20} />

                <span>Pengajuan PKL</span>
              </div>
            </li>

            <li className="p-4 rounded-2xl cursor-pointer transition-all duration-200 font-medium text-slate-700 hover:bg-slate-100">
              <div className="flex items-center gap-3">
                <Calendar size={20} />

                <span>Jadwal</span>
              </div>
            </li>

            <li className="p-4 rounded-2xl cursor-pointer transition-all duration-200 font-medium text-slate-700 hover:bg-slate-100">
              <div className="flex items-center gap-3">
                <FileText size={20} />

                <span>Rapor</span>
              </div>
            </li>
          </ul>
        </div>

        <button
          onClick={() => {
            localStorage.clear();

            window.location.reload();
          }}
          className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-2xl transition-all duration-200 font-medium flex items-center justify-center gap-3"
        >
          <LogOut size={20} />

          <span>Logout</span>
        </button>
      </div>

      <div className="flex-1 h-screen overflow-y-auto bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50">
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-10 py-5">
          <h1 className="text-3xl font-bold text-slate-800">
            Student Information System
          </h1>

          <p className="text-slate-500 mt-1">Portal akademik siswa</p>
        </div>

        <div className="p-10 pt-14">
          {page === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 mb-3">Status PKL</p>

                <h1
                  className={`text-4xl font-bold ${
                    statusPKL === "Disetujui"
                      ? "text-green-600"
                      : statusPKL === "Ditolak"
                        ? "text-red-600"
                        : "text-yellow-500"
                  }`}
                >
                  {statusPKL}
                </h1>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 mb-3">Semester</p>

                <h1 className="text-4xl font-bold text-slate-800">5</h1>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 mb-3">Nilai Terakhir</p>

                <h1 className="text-4xl font-bold text-blue-600">89</h1>
              </div>
            </div>
          )}

          {page === "pkl" && <PengajuanPKL />}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
