from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class QuestionBase(BaseModel):
    question: str


class QuestionCreate(QuestionBase):
    documentId: str


class QuestionResponse(QuestionBase):
    id: str
    documentId: str
    answer: str
    createdAt: datetime


class DocumentBase(BaseModel):
    filename: str
    title: Optional[str] = None


class DocumentCreate(DocumentBase):
    filepath: str


class DocumentResponse(DocumentBase):
    id: str
    filepath: str
    uploadedAt: datetime


class DocumentWithQuestions(DocumentResponse):
    questions: List[QuestionResponse] = []


class ErrorResponse(BaseModel):
    detail: str