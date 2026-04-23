// Helper to upload images to Cloudinary via Backend Proxy
// This is more secure as it doesn't expose Cloudinary credentials to the Frontend
import api from '../api/apiConfig';

export const uploadToCloudinary = async (file) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append('file', file);

  try {
    // Send file to our own backend instead of Cloudinary directly
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.secure_url;
  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
    throw new Error(errorMessage);
  }
};
