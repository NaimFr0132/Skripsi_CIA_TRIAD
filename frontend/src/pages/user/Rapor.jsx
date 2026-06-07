import { useEffect, useState } from "react";
import axios from "axios";

function Rapor() {
  const [nilai, setNilai] = useState([]);
  const [rataRata, setRataRata] = useState(0);
  const [selectedSemester, setSelectedSemester] = useState(null);

  const fetchRapor = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/nilai/my-rapor", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNilai(res.data.nilai);
      setRataRata(res.data.rata_rata);

      if (res.data.nilai.length > 0) {
        const latestSemester = Math.max(
          ...res.data.nilai.map((item) => item.semester),
        );

        setSelectedSemester(latestSemester);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRapor();
  }, []);

  const semesterList = [...new Set(nilai.map((item) => item.semester))].sort(
    (a, b) => a - b,
  );

  const filteredNilai = selectedSemester
    ? nilai.filter((item) => item.semester === Number(selectedSemester))
    : nilai;

  const rataRataFiltered =
    filteredNilai.length > 0
      ? (
          filteredNilai.reduce((total, item) => total + item.nilai_akhir, 0) /
          filteredNilai.length
        ).toFixed(1)
      : 0;

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">Rapor Siswa</h1>

        <p className="text-slate-500 mt-2">Nilai akademik dan kompetensi</p>
      </div>

      <div className="mb-6">
        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="border border-slate-200 rounded-2xl px-4 py-3"
        >
          <label className="block mb-2 font-medium text-slate-700">
            Pilih Semester
          </label>
          <option value="">Semua Semester</option>

          {semesterList.map((semester) => (
            <option key={semester} value={semester}>
              Semester {semester}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
        <p className="text-slate-500">Rata-rata Nilai</p>

        <h1 className="text-4xl font-bold text-blue-600 mt-2">
          {rataRataFiltered}
        </h1>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left p-5">Mata Pelajaran</th>

              <th className="text-left p-5">Nilai Akhir</th>

              <th className="text-left p-5">Kompetensi</th>

              <th className="text-left p-5">Semester</th>
            </tr>
          </thead>

          <tbody>
            {filteredNilai.map((item, index) => (
              <tr key={index} className="border-b border-slate-100">
                <td className="p-5">{item.mata_pelajaran}</td>

                <td className="p-5">{item.nilai_akhir}</td>

                <td className="p-5">{item.kompetensi}</td>

                <td className="p-5">{item.semester}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {nilai.length === 0 && (
          <div className="p-8 text-center text-slate-500">Belum ada nilai</div>
        )}
      </div>
    </div>
  );
}

export default Rapor;
