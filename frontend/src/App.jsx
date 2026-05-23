import Login from "./pages/Login";

import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

function App() {

  const token = localStorage.getItem("token");

  const role = localStorage.getItem("role");

  if (!token) {
    return <Login />;
  }

  if (role === "superadmin") {
    return <SuperAdminDashboard />;
  }

  if (role === "admin1") {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
}

export default App;