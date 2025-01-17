import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center">
          <div className="text-gray-400 text-sm">
            Developed by{' '}
            <a 
              href="https://lahcen.click" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white"
            >
              Lahcen El Hanchir
            </a>
            <div className="mt-2 text-gray-400 text-xs">
              © 2025 All rights reserved
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
