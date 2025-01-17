import React, { useCallback, useState } from 'react';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import Header from './Header';
import Footer from './Footer';
import { useDropzone } from 'react-dropzone';

const Home = () => {
  const [files, setFiles] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isConverting, setIsConverting] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    setIsConverting(true);
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('Please select only image files');
      setIsConverting(false);
      return;
    }

    const newImages = imageFiles.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({
          url: reader.result,
          file
        });
        reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImages)
      .then(imageData => {
        setFiles(prev => [...prev, ...imageData]);
      })
      .catch(error => {
        console.error('Error reading files:', error);
        alert('Error processing files. Please try again.');
      })
      .finally(() => {
        setIsConverting(false);
      });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const removeImage = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveImage = (fromIndex, toIndex) => {
    const newFiles = [...files];
    const [removed] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, removed);
    setFiles(newFiles);
  };

  const convertToPdf = async () => {
    setIsConverting(true);
    try {
      const doc = new jsPDF();
      
      for (let i = 0; i < files.length; i++) {
        const img = await loadImage(files[i].url);
        const imgWidth = doc.internal.pageSize.getWidth();
        const imgHeight = (img.height * imgWidth) / img.width;
        
        doc.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight);
        
        if (i < files.length - 1) {
          doc.addPage();
        }
      }

      const pdfBlob = doc.output('blob');
      setPdfUrl(URL.createObjectURL(pdfBlob));
      alert('PDF conversion complete!');
    } catch (error) {
      alert('Conversion failed: ' + error.message);
    } finally {
      setIsConverting(false);
    }
  };

  const downloadPdf = () => {
    if (pdfUrl) {
      saveAs(pdfUrl, 'converted-images.pdf');
    }
  };

  const loadImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = file;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Convert Photos to PDF
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Easily convert JPG images to PDF documents
            </p>
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl p-8">
              <div 
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
                  isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
                } ${isConverting ? 'opacity-50 cursor-wait' : ''}`}
              >
                <input {...getInputProps()} />
                <svg 
                  className="mx-auto h-12 w-12 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" 
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  {isDragActive ? 'Drop the files here...' : 'Drag and drop your photos here'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  or click to select files
                </p>
                <p className="mt-4 text-xs text-gray-500">
                  JPG, PNG, GIF, WEBP up to 50MB
                </p>
              </div>

              {files.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Selected Files:</h4>
                  <div className="space-y-4">
                    {files.map((file, index) => (
                      <div key={index} className="border-2 border-dashed border-gray-200 p-4 rounded-lg relative bg-white">
                        <img 
                          src={file.url} 
                          alt={`Preview ${index + 1}`} 
                          className="max-w-full max-h-96 object-contain mx-auto"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          {index > 0 && (
                            <button
                              onClick={() => moveImage(index, index - 1)}
                              className="p-1 bg-white rounded-full shadow hover:bg-gray-100"
                              title="Move up"
                            >
                              ▲
                            </button>
                          )}
                          {index < files.length - 1 && (
                            <button
                              onClick={() => moveImage(index, index + 1)}
                              className="p-1 bg-white rounded-full shadow hover:bg-gray-100"
                              title="Move down"
                            >
                              ▼
                            </button>
                          )}
                          <button
                            onClick={() => removeImage(index)}
                            className="p-1 bg-white rounded-full shadow hover:bg-red-100 text-red-500"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="flex gap-4">
                      <button
                        onClick={convertToPdf}
                        disabled={isConverting || files.length === 0}
                        className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-black text-base font-medium rounded-md text-black bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isConverting ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Converting...
                          </div>
                        ) : (
                          'Convert to PDF '
                        )}
                      </button>
                      <button
                        onClick={downloadPdf}
                        disabled={!pdfUrl}
                        className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Download PDF
                      </button>
                    </div>
                    <button
                      onClick={() => setFiles([])}
                      className="w-full inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Clear Files
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
