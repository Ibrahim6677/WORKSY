import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import type { AppDispatch } from '../../store';
import { 
  uploadFile, 
  deleteFile, 
  downloadFile, 
  fetchFiles,
  clearError,
  resetFileState 
} from '../../features/files/fileSlice';

export const useFiles = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { files, uploadProgress, loading, error } = useSelector(
    (state: RootState) => state.files
  );

  const handleUploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return dispatch(uploadFile(formData));
  };

  const handleDeleteFile = async (fileId: string) => {
    return dispatch(deleteFile(fileId));
  };

  const handleDownloadFile = async (fileId: string, fileName: string) => {
    const result = await dispatch(downloadFile(fileId));
    if (result.payload) {
      // Create download link
      const url = window.URL.createObjectURL(result.payload as Blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }
  };

  const handleFetchFiles = async (workspaceId: string) => {
    return dispatch(fetchFiles(workspaceId));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const handleResetFileState = () => {
    dispatch(resetFileState());
  };

  return {
    files,
    uploadProgress,
    loading,
    error,
    uploadFile: handleUploadFile,
    deleteFile: handleDeleteFile,
    downloadFile: handleDownloadFile,
    fetchFiles: handleFetchFiles,
    clearError: handleClearError,
    resetFileState: handleResetFileState,
  };
};
