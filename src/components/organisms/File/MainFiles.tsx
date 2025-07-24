import { useEffect, useState } from "react";
import { useFiles } from "../../../hooks/useFiles/useFiles";
import { useWorkspace } from "../../../hooks/useWorkspace/useWorkspace";
import FileUpload from "./FileUpload";
import pdfIcon from "../../../assets/images/files.svg";
import screenshotIcon from "../../../assets/images/gallery.svg";
import docxIcon from "../../../assets/images/documentcode.svg";
import xxlIcon from "../../../assets/images/documenttext.svg";

// Helper function to get file icon based on type
const getFileIcon = (type: string) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('pdf')) return pdfIcon;
  if (lowerType.includes('png') || lowerType.includes('jpg') || lowerType.includes('jpeg') || lowerType.includes('gif')) return screenshotIcon;
  if (lowerType.includes('doc') || lowerType.includes('docx')) return docxIcon;
  if (lowerType.includes('xls') || lowerType.includes('xlsx') || lowerType.includes('xxl')) return xxlIcon;
  return docxIcon; // default icon
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 1) return 'TODAY';
  if (diffDays <= 30) return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function MainFiles() {
  const { files, loading, error, fetchFiles, downloadFile } = useFiles();
  const { currentWorkspace } = useWorkspace();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    if (currentWorkspace?.id) {
      fetchFiles(currentWorkspace.id);
    }
  }, [currentWorkspace?.id, fetchFiles]);

  const handleDownload = async (fileId: string, fileName: string) => {
    await downloadFile(fileId, fileName);
  };

  const handleUploadSuccess = () => {
    setIsUploadModalOpen(false);
    if (currentWorkspace?.id) {
      fetchFiles(currentWorkspace.id);
    }
  };

  if (loading) {
    return (
      <div className="max-w-full mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6629DE]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-full mx-auto p-4">
        <div className="text-red-500 text-center p-4">
          خطأ في تحميل الملفات: {error}
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-full mx-auto p-4">
      {/* Header with Upload Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Files</h2>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-[#6629DE] text-white px-4 py-2 rounded-lg hover:bg-[#5520CC] transition-colors"
        >
          Upload Files
        </button>
      </div>
      
      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <select className="border px-4 py-1 rounded text-sm">
          <option>All</option>
        </select>
        <select className="border px-4 py-1 rounded text-sm">
          <option>Date</option>
        </select>
        <select className="border px-4 py-1 rounded text-sm">
          <option>Type</option>
        </select>
        <select className="border px-4 py-1 rounded text-sm">
          <option>Size</option>
        </select>
      </div>

      {/* Files List */}
      <div className="bg-white shadow rounded-md border border-[#A1A1A1] border-b-0">
        <div className="p-4 flex items-center space-x-3">
          <h4 className="font-semibold text-lg text-inter">Files</h4>
          <span className="text-sm bg-[#6629DE] text-white text-inter py-1 px-2 rounded-full">
            {files.length}
          </span>
        </div>
        
        {files.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>لا توجد ملفات متاحة</p>
          </div>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between border-b border-[#A1A1A1] p-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6">
                  <img
                    src={getFileIcon(file.type)}
                    alt={file.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="font-semibold">{file.name}</div>
                  <div className="text-sm text-gray-500">
                    {file.type.toUpperCase()} · {formatFileSize(file.size)} · {formatDate(file.uploadedAt)}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleDownload(file.id, file.name)}
                className="text-[#6629DE] hover:text-[#6629DE] text-xl cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="13"
                  viewBox="0 0 14 13"
                  fill="none"
                >
                  <path
                    d="M4 6.00977L7 9.00977L10 6.00977M7 9.00977V1.00977M1 11.0098C4.89 12.3098 9.11 12.3098 13 11.0098"
                    stroke="#6629DE"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Upload Files</h3>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        </div>
      )}
    </div>
  );
}
