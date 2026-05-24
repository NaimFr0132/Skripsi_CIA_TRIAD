import { useState } from "react";

import {
  LayoutDashboard,
  ClipboardCheck,
  GraduationCap,
  BookOpen,
  MessageSquare,
  User,
  LogOut,
  Bell,
  Search,
} from "lucide-react";

function AdminDashboard() {

  const [page, setPage] =
    useState("dashboard");

  const username =
    localStorage.getItem(
      "username"
    );

  return (

    <div className="flex bg-slate-100 min-h-screen">

      <div className="w-72 h-screen sticky top-0 bg-white border-r border-slate-200 p-6 flex flex-col justify-between">

        <div>

          <div className="mb-10">

            <h1 className="text-2xl font-bold text-slate-800">
              {username}
            </h1>

            <p className="text-slate-500 mt-1">
              Admin Workspace
            </p>

          </div>

          <ul className="space-y-3">

            <li
              onClick={() =>
                setPage("dashboard")
              }
              className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 font-medium ${
                page === "dashboard"
                  ? "bg-blue-600 text-white shadow-md scale-[1.02]"

                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >

              <div className="flex items-center gap-3">

                <LayoutDashboard
                  size={20}
                />

                <span>
                  Dashboard
                </span>

              </div>

            </li>

            <li
              onClick={() =>
                setPage("presensi")
              }
              className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 font-medium ${
                page === "presensi"
                  ? "bg-blue-600 text-white shadow-md scale-[1.02]"

                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >

              <div className="flex items-center gap-3">

                <ClipboardCheck
                  size={20}
                />

                <span>
                  Presensi
                </span>

              </div>

            </li>

            <li
              onClick={() =>
                setPage("nilai")
              }
              className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 font-medium ${
                page === "nilai"
                  ? "bg-blue-600 text-white shadow-md scale-[1.02]"

                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >

              <div className="flex items-center gap-3">

                <GraduationCap
                  size={20}
                />

                <span>
                  Penilaian
                </span>

              </div>

            </li>

            <li
              onClick={() =>
                setPage("pembelajaran")
              }
              className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 font-medium ${
                page ===
                "pembelajaran"
                  ? "bg-blue-600 text-white shadow-md scale-[1.02]"

                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >

              <div className="flex items-center gap-3">

                <BookOpen
                  size={20}
                />

                <span>
                  Pembelajaran
                </span>

              </div>

            </li>

            <li
              onClick={() =>
                setPage("komunikasi")
              }
              className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 font-medium ${
                page ===
                "komunikasi"
                  ? "bg-blue-600 text-white shadow-md scale-[1.02]"

                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >

              <div className="flex items-center gap-3">

                <MessageSquare
                  size={20}
                />

                <span>
                  Komunikasi
                </span>

              </div>

            </li>

            <li
              onClick={() =>
                setPage("profile")
              }
              className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 font-medium ${
                page === "profile"
                  ? "bg-blue-600 text-white shadow-md scale-[1.02]"

                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >

              <div className="flex items-center gap-3">

                <User size={20} />

                <span>
                  Profile
                </span>

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

          <span>
            Logout
          </span>

        </button>

      </div>

      <div className="flex-1 h-screen overflow-y-auto bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50">

        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-10 py-5 flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold text-slate-800">
              School Information System
            </h1>

            <p className="text-slate-500 mt-1">
              Workspace dan administrasi sekolah
            </p>

          </div>

          <div className="flex items-center gap-5">

            <div className="relative">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Cari..."
                className="pl-11 pr-5 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />

            </div>

            <button className="relative bg-white border border-slate-200 w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-all duration-200">

              <Bell
                size={20}
                className="text-slate-600"
              />

              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500"></div>

            </button>

          </div>

        </div>

        <div className="p-10 pt-14">

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300">

              <p className="text-slate-500 mb-3">
                Total Siswa
              </p>

              <h1 className="text-5xl font-bold text-slate-800">
                1,284
              </h1>

            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300">

              <p className="text-slate-500 mb-3">
                Kehadiran Hari Ini
              </p>

              <h1 className="text-5xl font-bold text-slate-800">
                96%
              </h1>

            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300">

              <p className="text-slate-500 mb-3">
                Tugas Belum Dinilai
              </p>

              <h1 className="text-5xl font-bold text-slate-800">
                48
              </h1>

            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300">

              <p className="text-slate-500 mb-3">
                Pengumuman Baru
              </p>

              <h1 className="text-5xl font-bold text-slate-800">
                3
              </h1>

            </div>

          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">

              <div className="flex items-center justify-between mb-8">

                <div>

                  <h2 className="text-2xl font-bold text-slate-800">
                    Aktivitas Pembelajaran
                  </h2>

                  <p className="text-slate-500 mt-1">
                    Aktivitas terbaru guru dan siswa
                  </p>

                </div>

              </div>

              <div className="space-y-5">

                <div className="border border-slate-200 rounded-2xl p-5 hover:bg-slate-50 transition-all duration-200">

                  <h3 className="font-semibold text-slate-800">
                    Input Nilai Matematika
                  </h3>

                  <p className="text-slate-500 mt-2">
                    Kelas XI IPA 1 telah diperbarui
                  </p>

                </div>

                <div className="border border-slate-200 rounded-2xl p-5 hover:bg-slate-50 transition-all duration-200">

                  <h3 className="font-semibold text-slate-800">
                    Presensi Siswa
                  </h3>

                  <p className="text-slate-500 mt-2">
                    Kehadiran kelas XII IPS 2 berhasil disimpan
                  </p>

                </div>

                <div className="border border-slate-200 rounded-2xl p-5 hover:bg-slate-50 transition-all duration-200">

                  <h3 className="font-semibold text-slate-800">
                    Modul Pembelajaran
                  </h3>

                  <p className="text-slate-500 mt-2">
                    Modul ajar Bahasa Indonesia ditambahkan
                  </p>

                </div>

              </div>

            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">

              <h2 className="text-2xl font-bold text-slate-800 mb-8">
                Aktivitas Saya
              </h2>

              <div className="space-y-6">

                <div className="flex gap-4">

                  <div className="w-3 h-3 rounded-full bg-blue-600 mt-2"></div>

                  <div>

                    <h3 className="font-semibold text-slate-800">
                      Login Sistem
                    </h3>

                    <p className="text-slate-500 mt-1">
                      Berhasil login dari perangkat sekolah
                    </p>

                  </div>

                </div>

                <div className="flex gap-4">

                  <div className="w-3 h-3 rounded-full bg-emerald-500 mt-2"></div>

                  <div>

                    <h3 className="font-semibold text-slate-800">
                      Input Nilai
                    </h3>

                    <p className="text-slate-500 mt-1">
                      Nilai siswa berhasil diperbarui
                    </p>

                  </div>

                </div>

                <div className="flex gap-4">

                  <div className="w-3 h-3 rounded-full bg-amber-500 mt-2"></div>

                  <div>

                    <h3 className="font-semibold text-slate-800">
                      Upload Modul
                    </h3>

                    <p className="text-slate-500 mt-1">
                      Modul pembelajaran berhasil diunggah
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default AdminDashboard;