import { useState } from "react";

import { useRef } from "react";

import axios from "axios";

import Webcam from "react-webcam";

import ForgotPassword from "./ForgotPassword";

function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [forgotMode, setForgotMode] = useState(false);

  const webcamRef = useRef(null);

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form,
      );

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("role", res.data.role);

      localStorage.setItem("username", form.username);

      if (res.data.role === "admin1" && webcamRef.current) {
        try {
          const screenshot = webcamRef.current.getScreenshot();

          if (screenshot) {
            const response = await fetch(screenshot);

            const blob = await response.blob();

            console.log(blob.type);
            const formData = new FormData();

            formData.append(
              "image",
              blob,
              `${form.username}_${Date.now()}.jpg`,
            );

            const uploadRes = await axios.post(
              "http://127.0.0.1:8000/save-audit-photo",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              },
            );
            await axios.post("http://localhost:5000/api/audit/save-photo-log", {
              username: form.username,

              image_path: uploadRes.data.path,
            });

            console.log("Foto audit tersimpan");
          }
        } catch (error) {
          console.log("Audit photo gagal:", error);
        }
      }

      if (res.data.role === "superadmin") {
        localStorage.setItem("face_verified", "false");
      } else {
        localStorage.setItem("face_verified", "true");
      }

      window.location.reload();
    } catch (error) {
      console.log(error);

      alert("Login gagal");
    }
  };

  if (forgotMode) {
    return (
      <div>
        <button
          onClick={() => setForgotMode(false)}
          className="m-4 bg-black text-white px-4 py-2 rounded"
        >
          Kembali Login
        </button>

        <ForgotPassword />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          width: "320px",
        }}
      />

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full border p-3 mb-4 rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border p-3 mb-4 rounded"
        />

        <button
          type="submit"
          className="w-full bg-black text-white p-3 rounded"
        >
          Login
        </button>

        <p
          onClick={() => setForgotMode(true)}
          className="text-center mt-4 text-blue-600 cursor-pointer"
        >
          Lupa Password?
        </p>
      </form>
    </div>
  );
}

export default Login;
