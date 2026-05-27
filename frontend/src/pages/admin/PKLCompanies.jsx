import { useEffect, useState } from "react";

import axios from "axios";

function PKLCompanies() {

  const [partners, setPartners] =
    useState([]);

  useEffect(() => {

    fetchPartners();

  }, []);

  const fetchPartners = async () => {

    try {

      const res =
        await axios.get(
          "http://localhost:5000/api/pkl-partner/all"
        );

      setPartners(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-slate-800">
          Daftar Mitra PKL
        </h1>

        <p className="text-slate-500 mt-2">
          Perusahaan partner untuk kegiatan PKL siswa
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {partners.map((item) => (

          <div
            key={item.id}
            className="border border-slate-200 rounded-3xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white"
          >

            <h2 className="text-2xl font-bold text-slate-800 mb-3">

              {item.nama_perusahaan}

            </h2>

            <div className="space-y-3">

              <p className="text-slate-600">

                <span className="font-semibold">
                  Bidang:
                </span>

                {" "}
                {item.bidang_industri}

              </p>

              <p className="text-slate-600">

                <span className="font-semibold">
                  Kontak:
                </span>

                {" "}
                {item.kontak}

              </p>

              <p className="text-slate-600">

                <span className="font-semibold">
                  Alamat:
                </span>

                {" "}
                {item.alamat}

              </p>

              <div className="pt-3">

                <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm">

                  Kuota:
                  {" "}
                  {item.kuota}

                </span>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default PKLCompanies;