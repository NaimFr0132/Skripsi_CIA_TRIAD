import Login from "./pages/Login";

import SuperAdminDashboard from "./pages/SuperAdminDashboard";

import AdminDashboard from "./pages/admin/AdminDashboard";

import UserDashboard from "./pages/user/UserDashboard";

import FaceVerification from "./pages/FaceVerification";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const token = localStorage.getItem("token");

  const role = localStorage.getItem("role");

  const faceVerified = localStorage.getItem("face_verified");

  if (!token) {
    return <Login />;
  }

  if (role === "superadmin" && faceVerified === "false") {
    return <FaceVerification />;
  }

  if (role === "superadmin") {
    return (
      <ProtectedRoute role="superadmin">
        <SuperAdminDashboard />
      </ProtectedRoute>
    );
  }

  if (role === "admin1") {
    return (
      <ProtectedRoute role="admin1">
        <AdminDashboard />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute role="user">
      <UserDashboard />
    </ProtectedRoute>
  );
}

export default App;
