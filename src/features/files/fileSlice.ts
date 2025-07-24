import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { apiRoutes } from "../../utils/constants/apiRoutes";

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

interface FileState {
  files: FileItem[];
  uploadProgress: Record<string, number>;
  loading: boolean;
  error: string | null;
}

const initialState: FileState = {
  files: [],
  uploadProgress: {},
  loading: false,
  error: null
};

// Async thunks
export const uploadFile = createAsyncThunk(
  'files/upload',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post<UploadResponse>(
        apiRoutes.files.upload,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.data.file;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'فشل في رفع الملف');
    }
  }
);

export const deleteFile = createAsyncThunk(
  'files/delete',
  async (fileId: string, { rejectWithValue }) => {
    try {
      await axios.delete(apiRoutes.files.delete(fileId));
      return fileId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'فشل في حذف الملف');
    }
  }
);

export const downloadFile = createAsyncThunk(
  'files/download',
  async (fileId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(apiRoutes.files.download(fileId), {
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'فشل في تنزيل الملف');
    }
  }
);

export const fetchFiles = createAsyncThunk(
  'files/fetchAll',
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(apiRoutes.files.getAll(workspaceId));
      return response.data.data?.files || response.data.files || response.data || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'فشل في جلب الملفات');
    }
  }
);

const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<FileItem[]>) => {
      state.files = action.payload;
    },
    addFile: (state, action: PayloadAction<FileItem>) => {
      state.files.unshift(action.payload);
    },
    removeFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter(file => file.id !== action.payload);
    },
    setUploadProgress: (state, action: PayloadAction<{ fileId: string; progress: number }>) => {
      const { fileId, progress } = action.payload;
      state.uploadProgress[fileId] = progress;
    },
    clearUploadProgress: (state, action: PayloadAction<string>) => {
      delete state.uploadProgress[action.payload];
    },
    clearError: (state) => {
      state.error = null;
    },
    resetFileState: (state) => {
      state.files = [];
      state.uploadProgress = {};
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Upload file
    builder
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.files.unshift(action.payload);
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete file
      .addCase(deleteFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.loading = false;
        state.files = state.files.filter(file => file.id !== action.payload);
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Download file
      .addCase(downloadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadFile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch files
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  setFiles,
  addFile,
  removeFile,
  setUploadProgress,
  clearUploadProgress,
  clearError,
  resetFileState
} = fileSlice.actions;

export default fileSlice.reducer;