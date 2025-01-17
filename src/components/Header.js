import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="h-8 w-auto"
            />
            <span className="ml-2 text-xl font-semibold text-gray-800">Photo to PDF</span>
          </Link>
        </div>
        <nav className="flex space-x-8">
          <Link to="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <Link to="/features" className="text-gray-500 hover:text-gray-700">
            Features
          </Link>
          <Link to="/help" className="text-gray-500 hover:text-gray-700">
            Help
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
