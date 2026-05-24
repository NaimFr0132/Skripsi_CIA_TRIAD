function RecentActivity({
  logs,
}) {

  return (

    <div className="bg-white mt-10 p-7 rounded-3xl border border-slate-200 shadow-sm">

      <h2 className="text-2xl font-bold mb-6 text-slate-800">
        Aktivitas Terbaru
      </h2>

      <div className="space-y-4">

        {logs.map((log) => {

          const date =
            new Date(
              log.created_at
            );

          return (

            <div
              key={log.id}
              className="border border-slate-200 rounded-2xl p-5 hover:bg-slate-50 hover:-translate-y-1 transition-all duration-200"
            >

              <div className="flex items-center gap-3 mb-2">

                <p className="font-semibold text-slate-800">
                  {log.username}
                </p>

                <span
                  className={
                    log.role === "superadmin"
                      ? "bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm"

                      : log.role === "admin1"
                      ? "bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm"

                      : "bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
                  }
                >
                  {log.role}
                </span>

              </div>

              <p className="text-slate-700">
                {log.activity}
              </p>

              <p className="text-sm text-slate-400 mt-2">
                {date.toLocaleString()}
              </p>

            </div>

          );

        })}

      </div>

    </div>

  );

}

export default RecentActivity;