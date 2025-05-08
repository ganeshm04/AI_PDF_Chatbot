from fastapi import APIRouter, HTTPException
from typing import List

from app.database import db
from app.schemas.schemas import QuestionCreate, QuestionResponse
from app.services.qa_service import get_answer, get_document_by_id

router = APIRouter()


@router.post("/", response_model=QuestionResponse)
async def ask_question(question_data: QuestionCreate):
    """Ask a question about a document"""
    # Check if document exists
    await get_document_by_id(question_data.documentId)
    
    # Get answer from document
    answer = await get_answer(question_data.documentId, question_data.question)
    
    # Retrieve the saved question with answer
    questions = await db.question.find_many(
        where={
            "documentId": question_data.documentId,
            "question": question_data.question
        },
        order={"createdAt": "desc"},
        take=1
    )
    
    if not questions:
        raise HTTPException(status_code=404, detail="Question not found")
    
    return questions[0]


@router.get("/document/{document_id}", response_model=List[QuestionResponse])
async def get_document_questions(document_id: str):
    """Get all questions for a document"""
    # Check if document exists
    await get_document_by_id(document_id)
    
    # Get questions for document
    questions = await db.question.find_many(
        where={"documentId": document_id},
        order={"createdAt": "asc"}
    )
    
    return questions