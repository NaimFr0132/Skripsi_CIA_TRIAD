function UserTable({
  users,
}) {

  return (

    <div className="bg-white mt-10 p-7 rounded-3xl border border-slate-200 shadow-sm">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-2xl font-bold text-slate-800">
          Daftar User
        </h2>

        <p className="text-slate-400">
          {users.length} user
        </p>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-200">

              <th className="text-left p-4 text-slate-500 font-semibold">
                ID
              </th>

              <th className="text-left p-4 text-slate-500 font-semibold">
                Username
              </th>

              <th className="text-left p-4 text-slate-500 font-semibold">
                Role
              </th>

              <th className="text-left p-4 text-slate-500 font-semibold">
                Email
              </th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr
                key={user.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition-all duration-200"
              >

                <td className="p-4 text-slate-700">
                  {user.id}
                </td>

                <td className="p-4 font-medium text-slate-800">
                  {user.username}
                </td>

                <td className="p-4">

                  <span
                    className={
                      user.role === "superadmin"
                        ? "bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm"

                        : user.role === "admin1"
                        ? "bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm"

                        : "bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
                    }
                  >
                    {user.role}
                  </span>

                </td>

                <td className="p-4 text-slate-600">
                  {user.email}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default UserTable;