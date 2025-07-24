import axiosInstance from "../axiosInstance";
import { apiRoutes } from "../../../utils/constants/apiRoutes";

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: {
    id: string;
    name: string;
  };
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    file: FileItem;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Upload file
export const uploadFile = async (formData: FormData): Promise<FileItem> => {
  const response = await axiosInstance.post<UploadResponse>(
    apiRoutes.files.upload,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data.data.file;
};

// Upload file with progress
export const uploadFileWithProgress = async (
  formData: FormData,
  onProgress?: (progress: number) => void
): Promise<FileItem> => {
  const response = await axiosInstance.post<UploadResponse>(
    apiRoutes.files.upload,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    }
  );
  return response.data.data.file;
};

// Get file by ID
export const getFileById = async (fileId: string): Promise<FileItem> => {
  const response = await axiosInstance.get<ApiResponse<FileItem>>(
    apiRoutes.files.getById(fileId)
  );
  return response.data.data;
};

// Download file
export const downloadFile = async (fileId: string): Promise<Blob> => {
  const response = await axiosInstance.get(apiRoutes.files.download(fileId), {
    responseType: 'blob',
  });
  return response.data;
};

// Download file with filename
export const downloadFileWithName = async (fileId: string, filename: string): Promise<void> => {
  const blob = await downloadFile(fileId);
  
  // Create download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Delete file
export const deleteFile = async (fileId: string): Promise<void> => {
  await axiosInstance.delete(apiRoutes.files.delete(fileId));
};

// Get all files (if needed)
export const getAllFiles = async (): Promise<FileItem[]> => {
  const response = await axiosInstance.get<ApiResponse<FileItem[]>>('/api/v1/files');
  return response.data.data;
};