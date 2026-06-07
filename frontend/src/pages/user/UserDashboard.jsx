import { useState, useEffect } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  FileText,
  LogOut,
} from "lucide-react";

import PengajuanPKL from "./PengajuanPKL";

import Rapor from "./Rapor";

function UserDashboard() {
  const [page, setPage] = useState("dashboard");

  const [profile, setProfile] = useState(null);

  const [statusPKL, setStatusPKL] = useState("Belum Mengajukan");

  const [partner, setPartner] = useState(null);

  const username = localStorage.getItem("username");

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/pkl-request/student",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.length > 0) {
        setStatusPKL(res.data[0].status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchStatus();
  }, []);

  useEffect(() => {
    if (profile?.partner_pkl_id) {
      fetchPartner(profile.partner_pkl_id);
    }
  }, [profile]);

  const fetchPartner = async (partnerId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/pkl-partner/${partnerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPartner(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const semester = profile?.semester || 0;

  const sudahDiterimaPKL = profile?.partner_pkl_id !== null;
// Syarat boleh mengajukan PKL: kelas 11 ke atas dan belum diterima PKL
  const bolehPKL = semester >= 5 && !sudahDiterimaPKL;

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <div className="w-72 h-screen sticky top-0 bg-white border-r border-slate-200 p-6 flex flex-col justify-between">
        <div>
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-slate-800">
              {profile?.nama_lengkap || username}
            </h1>

            <p className="text-slate-500 mt-1">
              {profile?.kelas || "Student Workspace"}
            </p>
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
              onClick={() => {
                if (bolehPKL) {
                  setPage("pkl");
                }
              }}
              className={`p-4 rounded-2xl transition-all duration-200 font-medium ${
                bolehPKL
                  ? page === "pkl"
                    ? "bg-blue-600 text-white shadow-md scale-[1.02] cursor-pointer"
                    : "text-slate-700 hover:bg-slate-100 cursor-pointer"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
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

            <li
              onClick={() => setPage("rapor")}
              className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 font-medium ${
                page === "rapor"
                  ? "bg-blue-600 text-white shadow-md scale-[1.02]"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-slate-500 mb-3">Status PKL</p>

                  <h1
                    className={`text-3xl font-bold ${
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

                  <h1 className="text-4xl font-bold text-slate-800">
                    {semester}
                  </h1>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-slate-500 mb-3">Kelas</p>

                  <h1 className="text-xl font-bold text-blue-600">
                    {profile?.kelas || "-"}
                  </h1>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-slate-500 mb-3">Status Akses PKL</p>

                  <h1
                    className={`text-xl font-bold ${
                      sudahDiterimaPKL
                        ? "text-blue-600"
                        : bolehPKL
                          ? "text-green-600"
                          : "text-red-600"
                    }`}
                  >
                    {sudahDiterimaPKL
                      ? "PKL Aktif"
                      : bolehPKL
                        ? "Diizinkan"
                        : "Terkunci"}
                  </h1>
                </div>
              </div>

              <div className="mt-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  Informasi PKL
                </h2>

                {sudahDiterimaPKL ? (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                    <p className="text-green-700 font-semibold text-lg">
                      Anda sudah diterima PKL
                    </p>

                    <div className="mt-4 space-y-2">
                      <p>
                        <span className="font-semibold">Perusahaan:</span>{" "}
                        {partner?.nama_perusahaan || "-"}
                      </p>

                      <p>
                        <span className="font-semibold">Bidang Industri:</span>{" "}
                        {partner?.bidang_industri || "-"}
                      </p>

                      <p>
                        <span className="font-semibold">Alamat:</span>{" "}
                        {partner?.alamat || "-"}
                      </p>

                      <p>
                        <span className="font-semibold">Kontak:</span>{" "}
                        {partner?.kontak || "-"}
                      </p>
                    </div>
                  </div>
                ) : semester < 5 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
                    <p className="text-yellow-700 font-semibold">
                      Pengajuan PKL dibuka mulai semester 5.
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                    <p className="text-blue-700 font-semibold">
                      Anda sudah memenuhi syarat untuk mengajukan PKL.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {page === "pkl" && <PengajuanPKL />}
          {page === "rapor" && <Rapor />}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
