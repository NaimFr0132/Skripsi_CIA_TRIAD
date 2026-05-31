import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

function PengajuanPKL() {
  const [partners, setPartners] = useState([]);

  const [myRequest, setMyRequest] = useState([]);

  const fetchPartners = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res =
        await axios.get(
          "http://localhost:5000/api/pkl-partner/all",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setPartners(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  const fetchMyRequest = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res =
        await axios.get(
          "http://localhost:5000/api/pkl-request/student",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setMyRequest(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {
    fetchPartners();

    fetchMyRequest();
  }, []);

  const ajukanPKL = async (partnerId) => {
    try {
      const token =
        localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/pkl-request/create",
        {
          partner_id: partnerId,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Pengajuan berhasil dikirim"
      );

      fetchMyRequest();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
          "Gagal mengajukan PKL"
      );

      console.log(error);

    }
  };

  const hasActiveRequest =
    myRequest.some(
      (item) =>
        item.status === "Menunggu" ||
        item.status === "Disetujui"
    );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-800">
          Pengajuan PKL
        </h1>

        <p className="text-slate-500 mt-2">
          Pilih perusahaan untuk kegiatan PKL
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Riwayat Pengajuan PKL
        </h2>

        <p className="text-slate-500 mb-6">
          Seluruh aktivitas pengajuan PKL siswa
        </p>

        <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2">
          {myRequest.length === 0 && (
            <p className="text-slate-500">
              Belum ada pengajuan PKL
            </p>
          )}

          {myRequest.map((item) => (
            <div
              key={item.id}
              className="border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all duration-200"
            >
              <h3 className="font-bold text-slate-800 text-xl">
                {item.nama_perusahaan}
              </h3>

              <p className="text-slate-500 mt-2">
                Pengajuan:{" "}
                {new Date(
                  item.created_at
                ).toLocaleDateString()}
              </p>

              <div className="mt-4">
                <span
                  className={
                    item.status ===
                    "Disetujui"
                      ? "bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm"
                      : item.status ===
                          "Ditolak"
                        ? "bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm"
                        : "bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm"
                  }
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {partners.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              {item.nama_perusahaan}
            </h2>

            <div className="space-y-3">
              <p className="text-slate-600">
                <span className="font-semibold">
                  Bidang:
                </span>{" "}
                {item.bidang_industri}
              </p>

              <p className="text-slate-600">
                <span className="font-semibold">
                  Kuota:
                </span>{" "}
                {item.kuota}
              </p>

              <p className="text-slate-600">
                <span className="font-semibold">
                  Kontak:
                </span>{" "}
                {item.kontak}
              </p>
            </div>

            <button
              onClick={() =>
                ajukanPKL(item.id)
              }
              disabled={hasActiveRequest}
              className={`mt-6 w-full py-4 rounded-2xl transition-all duration-200 ${
                hasActiveRequest
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {hasActiveRequest
                ? "Sudah Diajukan"
                : "Ajukan PKL"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PengajuanPKL;