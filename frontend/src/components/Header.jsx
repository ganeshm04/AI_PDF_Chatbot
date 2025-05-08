import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-blue-600 text-white shadow">
      <div className="container mx-auto py-4 px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">PDF Q&A App</Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-blue-200">Documents</Link>
            </li>
            <li>
              <Link to="/upload" className="hover:text-blue-200">Upload</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;