import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../services/apiService';

function DocumentChat() {
  const { documentId } = useParams();
  const [document, setDocument] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [answering, setAnswering] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchDocumentAndQuestions();
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchDocumentAndQuestions = async () => {
    try {
      setLoading(true);
      const documentData = await apiService.getDocumentById(documentId);
      setDocument(documentData);

      // Format existing questions and answers as messages
      if (documentData.questions && documentData.questions.length > 0) {
        const formattedMessages = documentData.questions.map(q => [
          { type: 'question', text: q.question, timestamp: new Date(q.createdAt) },
          { type: 'answer', text: q.answer, timestamp: new Date(q.createdAt) }
        ]).flat();
        
        setMessages(formattedMessages);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load document. Please try again.');
      console.error('Error fetching document:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    
    const newQuestion = question.trim();
    setQuestion('');
    
    // Add user question to messages
    const questionMessage = { type: 'question', text: newQuestion, timestamp: new Date() };
    setMessages(prevMessages => [...prevMessages, questionMessage]);
    
    try {
      setAnswering(true);
      
      // Show thinking indicator
      const thinkingMessage = { type: 'thinking', text: 'Analyzing document...', timestamp: new Date() };
      setMessages(prevMessages => [...prevMessages, thinkingMessage]);
      
      // Get answer from API
      const result = await apiService.askQuestion(documentId, newQuestion);
      
      // Remove thinking message and add answer
      setMessages(prevMessages => {
        const filtered = prevMessages.filter(msg => msg.type !== 'thinking');
        return [
          ...filtered, 
          { type: 'answer', text: result.answer, timestamp: new Date() }
        ];
      });
      
    } catch (err) {
      setError('Failed to get answer. Please try again.');
      console.error('Error getting answer:', err);
      
      // Remove thinking message and add error message
      setMessages(prevMessages => {
        const filtered = prevMessages.filter(msg => msg.type !== 'thinking');
        return [
          ...filtered, 
          { 
            type: 'error', 
            text: 'Sorry, I couldn\'t process your question. Please try again.', 
            timestamp: new Date() 
          }
        ];
      });
    } finally {
      setAnswering(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-xl text-gray-600">Loading document...</div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>Document not found or couldn't be loaded.</p>
          <Link to="/" className="text-red-700 font-bold hover:underline mt-2 inline-block">
            Back to Documents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <Link to="/" className="text-blue-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Documents
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        {/* Document header */}
        <div className="bg-blue-600 text-white p-4">
          <h1 className="text-xl font-bold">{document.title || document.filename}</h1>
          <p className="text-blue-100 text-sm">
            {document.filename} • Uploaded on {new Date(document.uploadedAt).toLocaleDateString()}
          </p>
        </div>
        
        {/* Chat messages */}
        <div className="p-4 h-[calc(100vh-300px)] overflow-y-auto bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-12 w-12 mx-auto text-gray-400 mb-3" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                />
              </svg>
              <p className="text-lg">Ask questions about this document</p>
              <p className="mt-2">For example: "What is the main topic of this document?" or "Summarize the key points."</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'question' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[75%] rounded-lg p-3 ${
                      message.type === 'question' 
                        ? 'bg-blue-600 text-white' 
                        : message.type === 'error'
                          ? 'bg-red-100 text-red-700'
                          : message.type === 'thinking'
                            ? 'bg-gray-200 text-gray-700 animate-pulse'
                            : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <div className={`text-xs mt-1 ${message.type === 'question' ? 'text-blue-200' : 'text-gray-500'}`}>
                      {formatTimestamp(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Input form */}
        <div className="p-4 border-t">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-3 text-sm" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleQuestionSubmit} className="flex">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={answering}
              placeholder="Ask a question about this document..."
              className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!question.trim() || answering}
              className={`px-4 py-2 rounded-r font-medium ${
                !question.trim() || answering
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {answering ? 'Processing...' : 'Ask'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DocumentChat;