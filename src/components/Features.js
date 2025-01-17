import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Features = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Features</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Image Upload</h2>
            <p className="text-gray-600">
              Easily upload multiple images in various formats including JPG, PNG, and more.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">PDF Conversion</h2>
            <p className="text-gray-600">
              Convert your images to high-quality PDF documents with just one click.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Drag & Drop</h2>
            <p className="text-gray-600">
              Intuitive drag and drop interface for easy file management.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Features;
