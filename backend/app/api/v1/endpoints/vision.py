from fastapi import APIRouter, UploadFile, File, HTTPException
from app.api.vision import vision_manager
import io


router = APIRouter()

@router.post("/identify")
async def identify_cultural_object(file: UploadFile = File (...)):
    #Validasi format file
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File harus berupa gambar")
    
    try:
        # Baca file ke memori
        request_object_content = await file.read()
        img_data = io.BytesIO(request_object_content)

        # Identifikasi lewat Vision Manager
        result = await vision_manager.identify(img_data)

        return {
            "status": "succes",
            "data": result,
            "message": "Object Berhasil Diidentifikasi"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))