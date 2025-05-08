from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from typing import List

from app.database import db
from app.schemas.schemas import DocumentResponse, DocumentWithQuestions
from app.services.pdf_service import process_pdf

router = APIRouter()


@router.post("/upload", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...)):
    """Upload a PDF document"""
    document_id = await process_pdf(file)
    document = await db.document.find_unique(where={"id": document_id})
    return document


@router.get("/", response_model=List[DocumentResponse])
async def get_documents():
    """Get all documents"""
    documents = await db.document.find_many(order={"uploadedAt": "desc"})
    return documents


@router.get("/{document_id}", response_model=DocumentWithQuestions)
async def get_document(document_id: str):
    """Get document by ID with its questions"""
    document = await db.document.find_unique(
        where={"id": document_id},
        include={"questions": True}
    )
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return document


@router.delete("/{document_id}", response_model=DocumentResponse)
async def delete_document(document_id: str):
    """Delete document by ID"""
    try:
        document = await db.document.delete(where={"id": document_id})
        return document
    except Exception:
        raise HTTPException(status_code=404, detail="Document not found")