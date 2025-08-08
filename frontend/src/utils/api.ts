/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const api = {
  async uploadImage(file: File): Promise<ApiResponse<{ url: string }>> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return { success: true, data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Upload failed' 
      };
    }
  },

  async deleteImage(publicId: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/upload/image/${publicId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Delete failed');
      }

      return { success: true, data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Delete failed' 
      };
    }
  }
}; 