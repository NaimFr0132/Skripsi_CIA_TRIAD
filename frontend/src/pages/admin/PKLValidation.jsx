import { useEffect, useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";

function PKLValidation() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pkl-request/all");

      setRequests(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const approveRequest = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/pkl-request/approve/${id}`);
      toast.success("Pengajuan disetujui");

      fetchRequests();
    } catch (error) {
      console.log(error);
    }
  };

  const rejectRequest = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/pkl-request/reject/${id}`);
      toast.error("Pengajuan ditolak");

      fetchRequests();
    } catch (error) {
      console.log(error);
    }
  };

  const totalPending = requests.filter(
    (item) => item.status === "Menunggu",
  ).length;

  const totalApproved = requests.filter(
    (item) => item.status === "Disetujui",
  ).length;

  const totalRejected = requests.filter(
    (item) => item.status === "Ditolak",
  ).length;

  return (
    <div className="space-y-10">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800">Validasi PKL</h1>

          <p className="text-slate-500 mt-2">Persetujuan pengajuan PKL siswa</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-6">
              <p className="text-yellow-600 font-medium">Menunggu</p>

              <h1 className="text-4xl font-bold text-yellow-700 mt-3">
                {totalPending}
              </h1>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-3xl p-6">
              <p className="text-green-600 font-medium">Disetujui</p>

              <h1 className="text-4xl font-bold text-green-700 mt-3">
                {totalApproved}
              </h1>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-3xl p-6">
              <p className="text-red-600 font-medium">Ditolak</p>

              <h1 className="text-4xl font-bold text-red-700 mt-3">
                {totalRejected}
              </h1>
            </div>
          </div>

          <div className="mt-6">
            <input
              type="text"
              placeholder="Cari nama siswa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Semua</option>

                <option>Menunggu</option>

                <option>Disetujui</option>

                <option>Ditolak</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left p-5">Nama Siswa</th>

                <th className="text-left p-5">Perusahaan</th>

                <th className="text-left p-5">Status</th>

                <th className="text-left p-5">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {requests
                .filter((item) => {
                  const cocokNama = item.siswa_nama
                    .toLowerCase()
                    .includes(search.toLowerCase());

                  const cocokStatus =
                    filterStatus === "Semua"
                      ? true
                      : item.status === filterStatus;

                  return cocokNama && cocokStatus;
                })
                .map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-all duration-200"
                  >
                    <td className="p-5 font-medium text-slate-800">
                      {item.siswa_nama}
                    </td>

                    <td className="p-5 text-slate-600">
                      {item.nama_perusahaan}
                    </td>

                    <td className="p-5">
                      <span
                        className={
                          item.status === "Disetujui"
                            ? "bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm"
                            : item.status === "Ditolak"
                              ? "bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm"
                              : "bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm"
                        }
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="p-5">
                      {item.status === "Menunggu" ? (
                        <div className="flex gap-3">
                          <button
                            onClick={() => approveRequest(item.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-all duration-200"
                          >
                            Setujui
                          </button>

                          <button
                            onClick={() => rejectRequest(item.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all duration-200"
                          >
                            Tolak
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium">
                          Sudah divalidasi
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">
          Riwayat Aktivitas Guru
        </h2>

        <div className="space-y-4">
          {requests
            .filter((item) => item.status !== "Menunggu")
            .map((item) => (
              <div
                key={item.id}
                className="border border-slate-200 rounded-2xl p-5 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold text-slate-800">
                    {item.siswa_nama}
                  </h3>

                  <p className="text-slate-500 mt-1">{item.nama_perusahaan}</p>
                </div>

                <span
                  className={
                    item.status === "Disetujui"
                      ? "bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm"
                      : "bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm"
                  }
                >
                  {item.status}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default PKLValidation;
