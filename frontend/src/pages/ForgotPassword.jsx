import { useState } from "react";

import axios from "axios";

function ForgotPassword() {

  const [email, setEmail] =
    useState("");

  const [message, setMessage] =
    useState("");

  const sendOTP = async () => {

    try {

      const res =
        await axios.post(
          "http://localhost:5000/api/forgot-password/send-otp",
          {
            email,
          }
        );

      setMessage(
        res.data.message
      );

    } catch (error) {

      console.log(error);

      setMessage(
        "Gagal mengirim OTP"
      );

    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-md w-96">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Forgot Password
        </h1>

        <input
          type="email"
          placeholder="Masukkan email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border p-3 mb-4 rounded"
        />

        <button
          onClick={sendOTP}
          className="w-full bg-black text-white p-3 rounded"
        >
          Kirim OTP
        </button>

        <p className="mt-4 text-center font-bold">
          {message}
        </p>

      </div>

    </div>

  );
}

export default ForgotPassword;