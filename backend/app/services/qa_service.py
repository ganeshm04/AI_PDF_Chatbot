from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI
from fastapi import HTTPException

from app.database import db
from app.services.pdf_service import extract_text_from_pdf


async def get_document_by_id(document_id: str):
    """Get document by ID"""
    document = await db.document.find_unique(where={"id": document_id})
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


async def create_qa_chain(document_id: str):
    """Create a QA chain for a document"""
    # Get document from database
    document = await get_document_by_id(document_id)
    
    # Extract text from PDF
    text = await extract_text_from_pdf(document.filepath)
    
    # Split text into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    chunks = text_splitter.split_text(text)
    
    # Create vector store
    embeddings = OpenAIEmbeddings()
    vector_store = FAISS.from_texts(chunks, embeddings)
    
    # Create QA chain
    qa_chain = RetrievalQA.from_chain_type(
        llm=ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0),
        chain_type="stuff",
        retriever=vector_store.as_retriever(),
        return_source_documents=True
    )
    
    return qa_chain


async def get_answer(document_id: str, question: str) -> str:
    """Get answer to a question from a document"""
    # Create QA chain
    qa_chain = await create_qa_chain(document_id)
    
    # Generate answer
    try:
        result = qa_chain({"query": question})
        answer = result["result"]
        
        # Save question and answer to database
        await db.question.create(
            data={
                "documentId": document_id,
                "question": question,
                "answer": answer
            }
        )
        
        return answer
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate answer: {str(e)}")