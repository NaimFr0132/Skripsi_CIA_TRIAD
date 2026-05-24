import Webcam from "react-webcam";

import { useRef, useState, useEffect } from "react";

import axios from "axios";

function FaceVerification() {
  const webcamRef = useRef(null);

  const [message, setMessage] = useState("Menunggu verifikasi wajah...");

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        if (!webcamRef.current) {
          return;
        }

        const screenshot = webcamRef.current.getScreenshot();

        if (!screenshot) {
          return;
        }

        const blob = await fetch(screenshot).then((res) => res.blob());

        const formData = new FormData();

        formData.append("image", blob, "face.jpg");

        const res = await axios.post(
          "http://127.0.0.1:8000/realtime-verify",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        console.log(res.data);

        if (res.data.verified) {
          setMessage("Wajah dikenali");

          localStorage.setItem("face_verified", "true");

          window.location.reload();
        } else {
          setMessage("Wajah tidak dikenali");

          localStorage.clear();

          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        }
      } catch (error) {
        console.log(error.response?.data);

        setMessage("Wajah tidak dikenali");

        setTimeout(() => {
          localStorage.clear();

          window.location.reload();
        }, 1500);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Face Verification</h1>

      <div className="rounded-xl overflow-hidden shadow-lg">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          className="w-[500px]"
        />
      </div>

      <p className="mt-6 text-xl font-bold text-blue-600">{message}</p>
    </div>
  );
}

export default FaceVerification;
