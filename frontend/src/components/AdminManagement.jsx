import { useState } from "react";

import axios from "axios";

function AdminManagement({
  admins,

  newAdmin,

  setNewAdmin,

  createAdmin,

  deleteAdmin,
  toggleUserStatus,
}) {
  const [search, setSearch] = useState("");

  const [editAdmin, setEditAdmin] = useState(null);

  const [editUsername, setEditUsername] = useState("");

  const updateAdmin = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/update/${editAdmin.id}`,

        {
          username: editUsername,
        },
      );

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h1 className="text-4xl font-bold text-slate-800">Kelola Admin</h1>

        <p className="text-slate-500 mt-2">Manajemen akun admin sekolah</p>

        <div className="mt-6">
          <input
            type="text"
            placeholder="Cari admin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Tambah Admin</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Username"
            value={newAdmin.username}
            onChange={(e) =>
              setNewAdmin({
                ...newAdmin,
                username: e.target.value,
              })
            }
            className="border border-slate-200 rounded-2xl px-5 py-4"
          />

          <input
            type="password"
            placeholder="Password"
            value={newAdmin.password}
            onChange={(e) =>
              setNewAdmin({
                ...newAdmin,
                password: e.target.value,
              })
            }
            className="border border-slate-200 rounded-2xl px-5 py-4"
          />

          <input
            type="email"
            placeholder="Email"
            value={newAdmin.email}
            onChange={(e) =>
              setNewAdmin({
                ...newAdmin,
                email: e.target.value,
              })
            }
            className="border border-slate-200 rounded-2xl px-5 py-4"
          />
        </div>

        <button
          onClick={createAdmin}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl"
        >
          Tambah Admin
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Daftar Admin</h2>

        <div className="space-y-4">
          {admins
            .filter((admin) =>
              admin.username.toLowerCase().includes(search.toLowerCase()),
            )
            .map((admin) => (
              <div
                key={admin.id}
                className="border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold text-slate-800">{admin.username}</h3>

                  <p className="text-slate-500 mt-1">{admin.email}</p>

                  <div className="mt-3">
                    <span
                      className={
                        admin.is_active
                          ? "bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm"
                          : "bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm"
                      }
                    >
                      {admin.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-end">
                  <button
                    onClick={() => {
                      setEditAdmin(admin);

                      setEditUsername(admin.username);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => toggleUserStatus(admin.id)}
                    className={
                      admin.is_active
                        ? "bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm"
                        : "bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm"
                    }
                  >
                    {admin.is_active ? "Nonaktifkan" : "Aktifkan"}
                  </button>

                  <button
                    onClick={() => deleteAdmin(admin.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {editAdmin && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl w-[400px]">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Edit Admin
            </h2>

            <input
              type="text"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              className="w-full border border-slate-200 rounded-2xl px-5 py-4"
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={updateAdmin}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl"
              >
                Simpan
              </button>

              <button
                onClick={() => setEditAdmin(null)}
                className="bg-slate-200 hover:bg-slate-300 px-5 py-3 rounded-2xl"
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

export default AdminManagement;
