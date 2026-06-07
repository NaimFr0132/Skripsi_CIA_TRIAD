from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from deepface import DeepFace
from fastapi.staticfiles import StaticFiles

import shutil
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

@app.get("/")
def home():

    return {
        "message": "AI Service Running"
    }


@app.post("/verify-face")
async def verify_face(
    image1: UploadFile = File(...),
    image2: UploadFile = File(...)
):

    try:

        path1 = f"{UPLOAD_DIR}/{image1.filename}"

        path2 = f"{UPLOAD_DIR}/{image2.filename}"

        with open(path1, "wb") as buffer:

            shutil.copyfileobj(
                image1.file,
                buffer
            )

        with open(path2, "wb") as buffer:

            shutil.copyfileobj(
                image2.file,
                buffer
            )

        result = DeepFace.verify(
            img1_path=path1,
            img2_path=path2,
            enforce_detection=True,
            detector_backend="opencv",
            model_name="Facenet",
        )

        distance = result["distance"]

        print("DISTANCE:", distance)

        verified = distance < 0.6

        return {
            "verified": verified,
            "distance": distance,
        }

    except Exception as e:

        return {
            "error": str(e)
        }


@app.post("/upload-test")
async def upload_test(
    image: UploadFile = File(...)
):

    return {
        "filename": image.filename,
        "message": "Upload berhasil"
    }


@app.post("/realtime-verify")
async def realtime_verify(
    image: UploadFile = File(...)
):

    try:

        temp_path = f"{UPLOAD_DIR}/temp.jpg"

        with open(temp_path, "wb") as buffer:

            shutil.copyfileobj(
                image.file,
                buffer
            )

        result = DeepFace.verify(
            img1_path=temp_path,
            img2_path="reference/superadmin.jpg",
            enforce_detection=True,
            detector_backend="opencv",
            model_name="Facenet",
        )

        distance = result["distance"]

        print("DISTANCE:", distance)

        verified = distance < 0.6

        return {
            "verified": verified,
            "distance": distance,
        }

    except Exception as e:

        return {
            "error": str(e)
        }
    
@app.post("/save-audit-photo")
async def save_audit_photo(
    image: UploadFile = File(...)
):

    try:

        audit_dir = "uploads/audit"

        os.makedirs(
            audit_dir,
            exist_ok=True
        )

        file_path = (
            f"{audit_dir}/"
            f"{image.filename}"
        )

        contents = await image.read()

        with open(
            file_path,
            "wb"
        ) as f:

            f.write(contents)

        return {

            "message":
                "Foto audit berhasil disimpan",

            "path":
                file_path

        }

    except Exception as e:

        return {
            "error":
                str(e)
        }