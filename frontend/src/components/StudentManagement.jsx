import { useEffect, useState } from "react";

import axios from "axios";

function StudentManagement() {
  const [students, setStudents] = useState([]);

  const [newStudent, setNewStudent] = useState({
    username: "",

    password: "",

    nama_lengkap: "",

    kelas: "",

    nisn: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/all");

      const siswa = res.data.filter((user) => user.role === "siswa");

      setStudents(siswa);
    } catch (error) {
      console.log(error);
    }
  };

  const createStudent = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/users/create-student",

        newStudent,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchStudents();

      setNewStudent({
        username: "",

        password: "",

        nama_lengkap: "",

        kelas: "",

        nisn: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/users/delete/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchStudents();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h1 className="text-4xl font-bold text-slate-800">Kelola Siswa</h1>

        <p className="text-slate-500 mt-2">Manajemen data siswa sekolah</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Tambah Siswa</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={newStudent.nama_lengkap}
            onChange={(e) =>
              setNewStudent({
                ...newStudent,
                nama_lengkap: e.target.value,
              })
            }
            className="border border-slate-200 rounded-2xl px-5 py-4"
          />

          <input
            type="text"
            placeholder="NISN"
            value={newStudent.nisn}
            onChange={(e) =>
              setNewStudent({
                ...newStudent,
                nisn: e.target.value,
              })
            }
            className="border border-slate-200 rounded-2xl px-5 py-4"
          />

          <input
            type="text"
            placeholder="Kelas"
            value={newStudent.kelas}
            onChange={(e) =>
              setNewStudent({
                ...newStudent,
                kelas: e.target.value,
              })
            }
            className="border border-slate-200 rounded-2xl px-5 py-4"
          />

          <input
            type="text"
            placeholder="Username"
            value={newStudent.username}
            onChange={(e) =>
              setNewStudent({
                ...newStudent,
                username: e.target.value,
              })
            }
            className="border border-slate-200 rounded-2xl px-5 py-4"
          />

          <input
            type="password"
            placeholder="Password"
            value={newStudent.password}
            onChange={(e) =>
              setNewStudent({
                ...newStudent,
                password: e.target.value,
              })
            }
            className="border border-slate-200 rounded-2xl px-5 py-4"
          />
        </div>

        <button
          onClick={createStudent}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl"
        >
          Tambah Siswa
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Daftar Siswa</h2>

        <div className="space-y-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <h3 className="font-bold text-slate-800">
                  {student.nama_lengkap}
                </h3>

                <p className="text-slate-500 mt-1">{student.kelas}</p>

                <p className="text-slate-400 text-sm mt-1">
                  NISN:
                  {student.nisn}
                </p>

                <div className="mt-3">
                  <span
                    className={
                      student.is_active
                        ? "bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm"
                        : "bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm"
                    }
                  >
                    {student.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");

                      await axios.put(
                        `http://localhost:5000/api/users/toggle-active/${student.id}`,
                        {},
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        },
                      );

                      fetchStudents();
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                  className={
                    student.is_active
                      ? "bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm"
                      : "bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm"
                  }
                >
                  {student.is_active ? "Nonaktifkan" : "Aktifkan"}
                </button>

                <button
                  onClick={() => deleteStudent(student.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentManagement;
