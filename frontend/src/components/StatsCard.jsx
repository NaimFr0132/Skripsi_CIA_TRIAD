import {
  Users,
  ShieldCheck,
  FileText,
} from "lucide-react";

function StatsCard({
  title,
  value,
}) {

  const getIcon = () => {

    if (title === "Total User") {

      return (
        <Users
          size={34}
          className="text-blue-600"
        />
      );

    }

    if (title === "Audit Hari Ini") {

      return (
        <FileText
          size={34}
          className="text-violet-600"
        />
      );

    }

    return (
      <ShieldCheck
        size={34}
        className="text-emerald-600"
      />
    );

  };

  const getBg = () => {

    if (title === "Total User") {

      return "bg-blue-50";

    }

    if (title === "Audit Hari Ini") {

      return "bg-violet-50";

    }

    return "bg-emerald-50";

  };

  const getDesc = () => {

    if (title === "Total User") {

      return "Semua pengguna terdaftar";

    }

    if (title === "Audit Hari Ini") {

      return "Log aktivitas hari ini";

    }

    return "Admin yang aktif";

  };

  return (

    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

      <div className="flex items-center gap-5">

        <div
          className={`w-20 h-20 rounded-3xl flex items-center justify-center ${getBg()}`}
        >

          {getIcon()}

        </div>

        <div>

          <p className="text-slate-500 font-medium mb-2">
            {title}
          </p>

          <h1 className="text-5xl font-bold text-slate-800">
            {value}
          </h1>

          <p className="text-slate-400 mt-2">
            {getDesc()}
          </p>

        </div>

      </div>

    </div>

  );

}

export default StatsCard;