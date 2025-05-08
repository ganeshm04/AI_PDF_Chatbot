import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import components
import Header from './components/Header';
import DocumentList from './pages/DocumentList';
import DocumentChat from './pages/DocumentChat';
import UploadDocument from './pages/UploadDocument';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <Routes>
            <Route path="/" element={<DocumentList />} />
            <Route path="/upload" element={<UploadDocument />} />
            <Route path="/document/:documentId" element={<DocumentChat />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;