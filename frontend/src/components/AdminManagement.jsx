function AdminManagement({
  admins,
  newAdmin,
  setNewAdmin,
  createAdmin,
  deleteAdmin,
}) {

  return (

    <div>

      <h1 className="text-4xl font-bold mb-8 text-slate-800">
        Kelola Admin
      </h1>

      <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm mb-10">

        <h2 className="text-2xl font-bold mb-6 text-slate-800">
          Tambah Admin
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            type="text"
            placeholder="Username"
            onChange={(e) =>
              setNewAdmin({
                ...newAdmin,
                username:
                  e.target.value,
              })
            }
            className="border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setNewAdmin({
                ...newAdmin,
                password:
                  e.target.value,
              })
            }
            className="border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            placeholder="Email"
            onChange={(e) =>
              setNewAdmin({
                ...newAdmin,
                email:
                  e.target.value,
              })
            }
            className="border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        <button
          onClick={createAdmin}
          className="mt-6 bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] text-white px-6 py-4 rounded-2xl transition-all duration-200 font-medium"
        >
          Tambah Admin
        </button>

      </div>

      <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl font-bold text-slate-800">
            Daftar Admin
          </h2>

          <p className="text-slate-400">
            {admins.length} admin
          </p>

        </div>

        <div className="space-y-4">

          {admins.map((admin) => (

            <div
              key={admin.id}
              className="border border-slate-200 rounded-2xl p-5 flex justify-between items-center hover:bg-slate-50 hover:-translate-y-1 transition-all duration-200"
            >

              <div>

                <p className="font-semibold text-slate-800">
                  {admin.username}
                </p>

                <p className="text-slate-500 mt-1">
                  {admin.email}
                </p>

              </div>

              <button
                onClick={() =>
                  deleteAdmin(admin.id)
                }
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl transition-all duration-200"
              >
                Hapus
              </button>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

export default AdminManagement;