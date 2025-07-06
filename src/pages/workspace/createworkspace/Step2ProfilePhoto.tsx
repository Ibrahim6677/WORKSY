import { useState, useRef } from 'react';

export default function Step2ProfilePhoto({ nextStep, prevStep }: { nextStep: () => void; prevStep: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [name, setName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="text-left w-full max-w-lg mx-auto">
      <h2 className="text-3xl font-bold mb-2">let's set up your workspace</h2>
      <h3 className="text-lg font-bold mb-1 mt-6">add your name and photo<span className='font-normal'></span></h3>
      <p className="text-gray-500 mb-6 text-sm">
        tell us your name and upload a photo to personalize your workspace
      </p>

      {/* Name Input Field */}
      <div className="mb-6">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Your Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          maxLength={50}
          className="w-full border border-gray-300 px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Profile Photo Upload Area */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Photo
        </label>
        {!previewUrl ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragOver 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-300 hover:border-purple-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              <span className="text-purple-600 font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src={previewUrl}
                alt="Profile preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <button
                onClick={handleRemovePhoto}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-3">{selectedFile?.name}</p>
            <button
              onClick={handleBrowseClick}
              className="text-sm text-purple-600 hover:text-purple-700 mt-2 underline"
            >
              Choose different photo
            </button>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="text-gray-600 px-6 py-2 rounded-md hover:bg-gray-100 transition text-sm font-semibold"
        >
          back
        </button>
        <button
          onClick={nextStep}
          disabled={!name.trim()}
          className={`px-8 py-2 rounded-md transition text-sm font-semibold ${
            name.trim() 
              ? 'bg-purple-600 text-white hover:bg-purple-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          next
        </button>
      </div>
    </div>
  );
}
