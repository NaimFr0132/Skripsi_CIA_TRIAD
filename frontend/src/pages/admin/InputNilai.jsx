
function InputNilai() {

  return (

    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-slate-800">
          Input Nilai
        </h1>

        <p className="text-slate-500 mt-2">
          Input nilai akhir dan kompetensi siswa
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <input
          type="text"
          placeholder="Nama Siswa"
          className="border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Mata Pelajaran"
          className="border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          placeholder="Nilai Akhir"
          className="border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          placeholder="Kompetensi Keahlian"
          className="border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl transition-all duration-200">

        Simpan Nilai

      </button>

    </div>

  );

}

export default InputNilai;