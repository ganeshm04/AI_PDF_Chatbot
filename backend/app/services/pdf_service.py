import os
import fitz  # PyMuPDF
import uuid
from datetime import datetime
from fastapi import UploadFile, HTTPException
from typing import Tuple

from app.config import UPLOAD_DIR, ALLOWED_EXTENSIONS, MAX_UPLOAD_SIZE
from app.database import db
from app.schemas.schemas import DocumentCreate


async def validate_pdf(file: UploadFile) -> None:
    """Validate the uploaded PDF file"""
    # Check file extension
    if not file.filename or not file.filename.lower().endswith(('.pdf')):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Check file size
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)  # Reset file pointer
    
    if file_size > MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds the maximum limit (10MB)")


async def save_pdf(file: UploadFile) -> Tuple[str, str]:
    """Save the uploaded PDF file to the filesystem"""
    # Create unique filename
    filename = file.filename
    unique_filename = f"{uuid.uuid4()}_{filename}"
    filepath = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save file
    try:
        with open(filepath, "wb") as buffer:
            buffer.write(await file.read())
        return filepath, filename
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")


async def extract_text_from_pdf(filepath: str) -> str:
    """Extract text content from PDF file"""
    try:
        text = ""
        with fitz.open(filepath) as pdf:
            for page in pdf:
                text += page.get_text()
        return text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract text from PDF: {str(e)}")


async def process_pdf(file: UploadFile) -> str:
    """Process the uploaded PDF file and store metadata in database"""
    # Validate PDF
    await validate_pdf(file)
    
    # Save PDF to filesystem
    filepath, original_filename = await save_pdf(file)
    
    # Extract text for title (using first line or first few characters)
    text = await extract_text_from_pdf(filepath)
    title = text.strip().split('\n')[0][:100] if text else original_filename
    
    # Create document in database
    document_data = DocumentCreate(
        filename=original_filename,
        filepath=filepath,
        title=title
    )
    
    document = await db.document.create(
        data={
            "filename": document_data.filename,
            "filepath": document_data.filepath,
            "title": document_data.title
        }
    )
    
    return document.id