import { useEffect, useState } from "react";

import axios from "axios";

function PKLPartnerManagement() {
  const [partners, setPartners] = useState([]);

  const [formData, setFormData] = useState({
    nama_perusahaan: "",
    alamat: "",
    kuota: "",
    kontak: "",
    bidang_industri: "",
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pkl-partner/all");

      setPartners(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createPartner = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/pkl-partner/create",
        formData,
      );

      alert("Mitra PKL berhasil ditambahkan");

      setFormData({
        nama_perusahaan: "",
        alamat: "",
        kuota: "",
        kontak: "",
        bidang_industri: "",
      });

      fetchPartners();
    } catch (error) {
      console.log(error);
    }
  };

  const deletePartner = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/pkl-partner/delete/${id}`);

      alert("Mitra PKL berhasil dihapus");

      fetchPartners();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800">
            Tambah Mitra PKL
          </h1>

          <p className="text-slate-500 mt-2">
            Tambahkan perusahaan partner sekolah
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Nama Perusahaan"
            value={formData.nama_perusahaan}
            onChange={(e) =>
              setFormData({
                ...formData,
                nama_perusahaan: e.target.value,
              })
            }
            className="border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Alamat"
            value={formData.alamat}
            onChange={(e) =>
              setFormData({
                ...formData,
                alamat: e.target.value,
              })
            }
            className="border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            placeholder="Kuota"
            value={formData.kuota}
            onChange={(e) =>
              setFormData({
                ...formData,
                kuota: e.target.value,
              })
            }
            className="border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Kontak"
            value={formData.kontak}
            onChange={(e) =>
              setFormData({
                ...formData,
                kontak: e.target.value,
              })
            }
            className="border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Bidang Industri"
            value={formData.bidang_industri}
            onChange={(e) =>
              setFormData({
                ...formData,
                bidang_industri: e.target.value,
              })
            }
            className="border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
          />
        </div>

        <button
          onClick={createPartner}
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl transition-all duration-200"
        >
          Tambah Mitra
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800">
            Daftar Mitra PKL
          </h1>

          <p className="text-slate-500 mt-2">Perusahaan partner sekolah</p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left p-5">Perusahaan</th>

                <th className="text-left p-5">Bidang</th>

                <th className="text-left p-5">Kuota</th>

                <th className="text-left p-5">Kontak</th>
                <th className="text-left p-5">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {partners.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-all duration-200"
                >
                  <td className="p-5 font-medium text-slate-800">
                    {item.nama_perusahaan}
                  </td>

                  <td className="p-5 text-slate-600">{item.bidang_industri}</td>

                  <td className="p-5">
                    <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm">
                      {item.kuota}
                    </span>
                  </td>

                  <td className="p-5 text-slate-600">{item.kontak}</td>
                  <td className="p-5">
                    <button
                      onClick={() => deletePartner(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all duration-200"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PKLPartnerManagement;
