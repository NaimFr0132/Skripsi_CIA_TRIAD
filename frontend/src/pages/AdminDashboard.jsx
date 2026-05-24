function AdminDashboard() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Dashboard Admin1
      </h1>
      <button
        onClick={() => {

    localStorage.clear();

    window.location.reload();

        }}
        className="bg-gray-700 text-white px-4 py-2 rounded"
      >
        Kembali ke Login
      </button>
    </div>
  );
}

export default AdminDashboard;
  