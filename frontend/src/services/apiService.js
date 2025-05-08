import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const apiService = {
  // Document endpoints
  async uploadDocument(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_URL}/documents/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  async getDocuments() {
    const response = await axios.get(`${API_URL}/documents/`);
    return response.data;
  },
  
  async getDocumentById(documentId) {
    const response = await axios.get(`${API_URL}/documents/${documentId}`);
    return response.data;
  },
  
  async deleteDocument(documentId) {
    const response = await axios.delete(`${API_URL}/documents/${documentId}`);
    return response.data;
  },
  
  // QA endpoints
  async askQuestion(documentId, question) {
    const response = await axios.post(`${API_URL}/qa/`, {
      documentId,
      question,
    });
    return response.data;
  },
  
  async getDocumentQuestions(documentId) {
    const response = await axios.get(`${API_URL}/qa/document/${documentId}`);
    return response.data;
  },
};

export default apiService;