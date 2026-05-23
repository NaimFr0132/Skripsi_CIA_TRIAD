from fastapi import FastAPI, File, UploadFile
from deepface import DeepFace

import shutil
import os

app = FastAPI()

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/")
def home():
    return {"message": "AI Service Running"}


@app.post("/verify-face")
async def verify_face(image1: UploadFile = File(...), image2: UploadFile = File(...)):

    try:

        path1 = f"{UPLOAD_DIR}/{image1.filename}"
        path2 = f"{UPLOAD_DIR}/{image2.filename}"

        with open(path1, "wb") as buffer:
            shutil.copyfileobj(image1.file, buffer)

        with open(path2, "wb") as buffer:
            shutil.copyfileobj(image2.file, buffer)

        result = DeepFace.verify(
            img1_path=path1,
            img2_path=path2,
            enforce_detection=False,
            detector_backend="opencv",
            model_name="Facenet",
        )

        return {
            "verified": (result["verified"] or result["distance"] < 0.75),
            "distance": result["distance"],
        }

    except Exception as e:

        return {"error": str(e)}
