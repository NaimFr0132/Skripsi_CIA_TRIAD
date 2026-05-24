import { LayoutDashboard, Shield, Users, Download, LogOut } from "lucide-react";

function Sidebar({ page, setPage, username }) {
  return (
    <div className="w-72 h-screen sticky top-0 bg-white border-r border-slate-200 p-6 flex flex-col justify-between">
      <div>
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-slate-800">{username}</h1>

          <p className="text-slate-500 mt-1">Security Dashboard</p>
        </div>

        <ul className="space-y-3">
          <li
            onClick={() => setPage("dashboard")}
            className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 font-medium ${
              page === "dashboard"
                ? "bg-blue-600 text-white shadow-md scale-[1.02]"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard size={20} />

              <span>Dashboard</span>
            </div>
          </li>

          <li
            onClick={() => setPage("audit")}
            className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 font-medium ${
              page === "audit"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <Shield size={20} />

              <span>Audit Log</span>
            </div>
          </li>

          <li
            onClick={() => setPage("admin-management")}
            className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 font-medium ${
              page === "admin-management"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <Users size={20} />

              <span>Kelola Admin</span>
            </div>
          </li>

          <li className="p-4 rounded-2xl cursor-pointer transition-all duration-200 font-medium text-slate-700 hover:bg-slate-100">
            <div className="flex items-center gap-3">
              <Download size={20} />

              <span>Download Report</span>
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

        <span>Logout</span>
      </button>
    </div>
  );
}

export default Sidebar;
