import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
} from "lucide-react";

function SidebarAdmin({
  page,
  setPage,
  username,
}) {

  return (

    <div className="w-72 h-screen sticky top-0 bg-white border-r border-slate-200 p-6 flex flex-col justify-between">

      <div>

        <div className="mb-10">

          <h1 className="text-2xl font-bold text-slate-800">
            {username}
          </h1>

          <p className="text-slate-500 mt-1">
            Admin Workspace
          </p>

        </div>

        <ul className="space-y-3">

          <li
            onClick={() =>
              setPage("dashboard")
            }
            className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 font-medium ${
              page === "dashboard"
                ? "bg-blue-600 text-white shadow-md scale-[1.02]"

                : "text-slate-700 hover:bg-slate-100"
            }`}
          >

            <div className="flex items-center gap-3">

              <LayoutDashboard size={20} />

              <span>
                Dashboard
              </span>

            </div>

          </li>

          <li
            onClick={() =>
              setPage("activity")
            }
            className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 font-medium ${
              page === "activity"
                ? "bg-blue-600 text-white shadow-md scale-[1.02]"

                : "text-slate-700 hover:bg-slate-100"
            }`}
          >

            <div className="flex items-center gap-3">

              <FileText size={20} />

              <span>
                Aktivitas Saya
              </span>

            </div>

          </li>

          <li
            onClick={() =>
              setPage("profile")
            }
            className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 font-medium ${
              page === "profile"
                ? "bg-blue-600 text-white shadow-md scale-[1.02]"

                : "text-slate-700 hover:bg-slate-100"
            }`}
          >

            <div className="flex items-center gap-3">

              <User size={20} />

              <span>
                Profile
              </span>

            </div>

          </li>

        </ul>

      </div>

      <button
        onClick={() => {

          localStorage.clear();

          window.location.reload();

        }}
        className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-2xl transition-all duration-200 font-medium flex items-center justify-center gap-3"
      >

        <LogOut size={20} />

        <span>
          Logout
        </span>

      </button>

    </div>

  );

}

export default SidebarAdmin;