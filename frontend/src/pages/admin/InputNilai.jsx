import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function InputNilai() {
  const [students, setStudents] = useState([]);
  const [nilaiList, setNilaiList] = useState([]);
  const [formData, setFormData] = useState({
    siswa_id: "",
    mata_pelajaran: "",
    nilai_akhir: "",
    kompetensi: "",
    semester: "",
  });

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/nilai/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudents(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Gagal mengambil data siswa");
    }
  };

  const fetchNilai = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/api/nilai/all",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("NILAI LIST", res.data);

    setNilaiList(res.data);
  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
    fetchStudents();
    fetchNilai();
  }, []);

  const handleStudentChange = (e) => {
    const selectedId = e.target.value;

    const selectedStudent = students.find(
      (student) => student.id === Number(selectedId),
    );

    setFormData((prev) => ({
      ...prev,
      siswa_id: selectedId,
      semester: selectedStudent?.semester || "",
    }));
  };

  const handleSubmit = async () => {
    try {
      if (
        !formData.siswa_id ||
        !formData.mata_pelajaran ||
        !formData.nilai_akhir ||
        !formData.kompetensi
      ) {
        toast.error("Semua field wajib diisi");
        return;
      }

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/nilai/create",
        {
          siswa_id: Number(formData.siswa_id),
          mata_pelajaran: formData.mata_pelajaran,
          nilai_akhir: Number(formData.nilai_akhir),
          kompetensi: Number(formData.kompetensi),
          semester: Number(formData.semester),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Nilai berhasil disimpan");
      fetchNilai();

      setFormData({
        siswa_id: "",
        mata_pelajaran: "",
        nilai_akhir: "",
        kompetensi: "",
        semester: "",
      });
    } catch (error) {
      console.log(error);
      toast.error("Gagal menyimpan nilai");
    }
  };
  const handleDelete = async (id) => {
    try {
      const konfirmasi = window.confirm("Yakin ingin menghapus nilai ini?");

      if (!konfirmasi) return;

      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/nilai/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Nilai berhasil dihapus");

      fetchNilai();
    } catch (error) {
      console.log(error);

      toast.error("Gagal menghapus nilai");
    }
  };

  // const filteredNilai = formData.siswa_id
  //   ? nilaiList.filter((item) => item.siswa_id === Number(formData.siswa_id))
  //   : nilaiList;

  console.log("SELECTED SISWA", formData.siswa_id);

const filteredNilai = formData.siswa_id
  ? nilaiList.filter((item) => {
      console.log(
        "COMPARE",
        item.siswa_id,
        typeof item.siswa_id,
        formData.siswa_id,
        typeof formData.siswa_id
      );

      return item.siswa_id === Number(formData.siswa_id);
    })
  : nilaiList;

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">Input Nilai Siswa</h1>

        <p className="text-slate-500 mt-2">
          Input nilai akademik dan kompetensi siswa PKL
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <select
          value={formData.siswa_id}
          onChange={handleStudentChange}
          className="border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Pilih Siswa</option>

          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.nama_lengkap} | Kelas {student.kelas}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Mata Pelajaran"
          value={formData.mata_pelajaran}
          onChange={(e) =>
            setFormData({
              ...formData,
              mata_pelajaran: e.target.value,
            })
          }
          className="border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          placeholder="Nilai Akhir"
          value={formData.nilai_akhir}
          onChange={(e) =>
            setFormData({
              ...formData,
              nilai_akhir: e.target.value,
            })
          }
          className="border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          placeholder="Kompetensi"
          value={formData.kompetensi}
          onChange={(e) =>
            setFormData({
              ...formData,
              kompetensi: e.target.value,
            })
          }
          className="border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          readOnly
          value={formData.semester}
          placeholder="Semester"
          className="border border-slate-200 p-4 rounded-2xl bg-slate-100"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl transition-all duration-200"
      >
        Simpan Nilai
      </button>
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-5">
          Daftar Nilai Siswa
        </h2>

        <div className="overflow-x-auto border border-slate-200 rounded-3xl">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-4 text-left">Nama</th>

                <th className="p-4 text-left">Mapel</th>

                <th className="p-4 text-left">Nilai</th>

                <th className="p-4 text-left">Kompetensi</th>

                <th className="p-4 text-left">Semester</th>
                <th className="p-4 text-left">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredNilai.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-4">{item.nama_lengkap}</td>

                  <td className="p-4">{item.mata_pelajaran}</td>

                  <td className="p-4">{item.nilai_akhir}</td>

                  <td className="p-4">{item.kompetensi}</td>

                  <td className="p-4">{item.semester}</td>

                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
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

export default InputNilai;
