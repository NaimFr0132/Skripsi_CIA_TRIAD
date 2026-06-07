import { useEffect, useState } from "react";

import axios from "axios";

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);

  const [newStudent, setNewStudent] = useState({
    username: "",
    password: "",
    nama_lengkap: "",
    kelas: "",
    semester: 1,
    nisn: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/users/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
        semester: 1,
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

  const handleUpdateStudent = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/users/update/${editingStudent.id}`,
        {
          username: editingStudent.username,
          nama_lengkap: editingStudent.nama_lengkap,
          kelas: editingStudent.kelas,
          semester: Number(editingStudent.semester),
          nisn: editingStudent.nisn,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setEditingStudent(null);

      fetchStudents();

      alert("Data siswa berhasil diperbarui");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Gagal memperbarui data siswa");
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
            type="number"
            placeholder="Semester"
            value={newStudent.semester}
            onChange={(e) =>
              setNewStudent({
                ...newStudent,
                semester: e.target.value,
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
                <p className="text-slate-500">Semester {student.semester}</p>

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
                  onClick={() =>
                    setEditingStudent({
                      ...student,
                    })
                  }
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm"
                >
                  Edit
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
      {editingStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl w-[500px]">
            <h2 className="text-2xl font-bold mb-6">Edit Siswa</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={editingStudent.username}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    username: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3"
              />

              <input
                type="text"
                placeholder="Nama Lengkap"
                value={editingStudent.nama_lengkap || ""}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    nama_lengkap: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3"
              />

              <input
                type="text"
                placeholder="Kelas"
                value={editingStudent.kelas || ""}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    kelas: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3"
              />

              <input
                type="number"
                placeholder="Semester"
                value={editingStudent.semester || 1}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    semester: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3"
              />

              <input
                type="text"
                placeholder="NISN"
                value={editingStudent.nisn || ""}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    nisn: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateStudent}
                className="bg-blue-600 text-white px-5 py-3 rounded-xl"
              >
                Simpan
              </button>

              <button
                onClick={() => setEditingStudent(null)}
                className="bg-slate-200 px-5 py-3 rounded-xl"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentManagement;
