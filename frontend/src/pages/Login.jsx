import { useState } from "react";

import { useRef } from "react";

import axios from "axios";

import Webcam from "react-webcam";

import ForgotPassword from "./ForgotPassword";

function Login() {

  const [form, setForm] =
    useState({
      username: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [forgotMode, setForgotMode] =
    useState(false);

  const webcamRef =
    useRef(null);

  const handleChange =
    (e) => {

      setForm({
        ...form,

        [e.target.name]:
          e.target.value,
      });

    };

  const handleLogin =
    async (e) => {

      e.preventDefault();

      setLoading(true);

      try {

        const res =
          await axios.post(
            "http://localhost:5000/api/auth/login",
            form
          );

        localStorage.setItem(
          "token",
          res.data.token
        );

        localStorage.setItem(
          "role",
          res.data.role
        );

        localStorage.setItem(
          "username",
          form.username
        );

        if (
          res.data.role === "admin"
          &&
          webcamRef.current
        ) {

          try {

            const screenshot =
              webcamRef.current.getScreenshot();

            if (screenshot) {

              const response =
                await fetch(screenshot);

              const blob =
                await response.blob();

              const formData =
                new FormData();

              formData.append(
                "image",
                blob,
                `${form.username}_${Date.now()}.jpg`
              );

              const uploadRes =
                await axios.post(
                  "http://127.0.0.1:8000/save-audit-photo",
                  formData,
                  {
                    headers: {
                      "Content-Type":
                        "multipart/form-data",
                    },
                  }
                );

              console.log(
                "Upload Result:",
                uploadRes.data
              );

              await axios.post(
                "http://localhost:5000/api/audit/save-photo-log",
                {

                  username:
                    form.username,

                  image_path:
                    uploadRes.data.path,

                }
              );

              console.log(
                "Foto audit berhasil tersimpan"
              );

            }

          } catch (error) {

            console.log(
              "Audit photo gagal:",
              error
            );

          }

        }

        if (
          res.data.role === "superadmin"
        ) {

          localStorage.setItem(
            "face_verified",
            "false"
          );

        } else {

          localStorage.setItem(
            "face_verified",
            "true"
          );

        }

        window.location.reload();

      } catch (error) {

        console.log(error);

        alert(
          "Login gagal"
        );

      } finally {

        setLoading(false);

      }

    };

  if (forgotMode) {

    return (

      <div>

        <button
          onClick={() =>
            setForgotMode(false)
          }
          className="m-4 bg-black text-white px-4 py-2 rounded-xl"
        >
          Kembali Login
        </button>

        <ForgotPassword />

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          width: 320,
          height: 240,
          facingMode: "user",
        }}
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-slate-200 p-10">

        <div className="mb-8 text-center">

          <h1 className="text-4xl font-bold text-slate-800">
            Login
          </h1>

          <p className="text-slate-500 mt-3">
            School Security System
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <div>

            <label className="block text-sm font-medium text-slate-600 mb-2">
              Username
            </label>

            <input
              type="text"
              name="username"
              placeholder="Masukkan username"
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

          </div>

          <div>

            <label className="block text-sm font-medium text-slate-600 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Masukkan password"
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white py-4 rounded-2xl font-medium"
          >
            {
              loading
                ? "Loading..."
                : "Login"
            }
          </button>

        </form>

        <p
          onClick={() =>
            setForgotMode(true)
          }
          className="text-center mt-6 text-blue-600 cursor-pointer hover:text-blue-700 transition-all duration-200"
        >
          Lupa Password?
        </p>

      </div>

    </div>

  );

}

export default Login;