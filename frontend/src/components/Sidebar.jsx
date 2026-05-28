import { useState } from "react";

import {
  LayoutDashboard,
  Shield,
  Users,
  Building2,
  GraduationCap,
  ChevronDown,
  LogOut,
} from "lucide-react";

function Sidebar({

  page,

  setPage,

  username,

}) {

  const [openManage, setOpenManage] =
    useState(false);

  return (

    <div className="w-72 h-screen sticky top-0 bg-white border-r border-slate-200 p-6 flex flex-col justify-between shadow-sm">

      <div>

        <div className="mb-10">

          <h1 className="text-2xl font-bold text-slate-800">

            {username}

          </h1>

          <p className="text-slate-500 mt-1">

            Security Dashboard

          </p>

        </div>

        <ul className="space-y-3">

          <li
            onClick={() =>
              setPage(
                "dashboard"
              )
            }
            className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 font-medium ${
              page === "dashboard"

                ? "bg-blue-600 text-white shadow-lg scale-[1.02]"

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

          <li>

            <div
              onClick={() =>
                setOpenManage(
                  !openManage
                )
              }
              className="p-4 rounded-2xl cursor-pointer transition-all duration-300 font-medium text-slate-700 hover:bg-slate-100"
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <Users size={20} />

                  <span>
                    Kelola
                  </span>

                </div>

                <ChevronDown
                  size={18}
                  className={`transition-all duration-300 ${
                    openManage
                      ? "rotate-180"
                      : ""
                  }`}
                />

              </div>

            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openManage

                  ? "max-h-52 mt-2"

                  : "max-h-0"
              }`}
            >

              <div
                onClick={() =>
                  setPage(
                    "admin-management"
                  )
                }
                className={`ml-6 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  page ===
                  "admin-management"

                    ? "bg-blue-600 text-white shadow-md"

                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >

                Kelola Admin

              </div>

              <div
                onClick={() =>
                  setPage(
                    "student-management"
                  )
                }
                className={`ml-6 mt-2 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  page ===
                  "student-management"

                    ? "bg-blue-600 text-white shadow-md"

                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >

                Kelola Siswa

              </div>

            </div>

          </li>

          <li
            onClick={() =>
              setPage(
                "pkl-partner"
              )
            }
            className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 font-medium ${
              page === "pkl-partner"

                ? "bg-blue-600 text-white shadow-lg"

                : "text-slate-700 hover:bg-slate-100"
            }`}
          >

            <div className="flex items-center gap-3">

              <Building2 size={20} />

              <span>
                Mitra PKL
              </span>

            </div>

          </li>

          <li
            onClick={() =>
              setPage(
                "audit"
              )
            }
            className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 font-medium ${
              page === "audit"

                ? "bg-blue-600 text-white shadow-lg"

                : "text-slate-700 hover:bg-slate-100"
            }`}
          >

            <div className="flex items-center gap-3">

              <Shield size={20} />

              <span>
                Audit Log
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
        className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-2xl transition-all duration-300 font-medium flex items-center justify-center gap-3 shadow-md"
      >

        <LogOut size={20} />

        <span>
          Logout
        </span>

      </button>

    </div>

  );

}

export default Sidebar;