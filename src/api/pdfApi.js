import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/pdf';

export const uploadPdf = async (file: File, adminId: string, weekNumber: number) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('adminId', adminId);
    formData.append('weekNumber', weekNumber.toString());
  
    try {
      const response = await axios.post(
        'http://localhost:3000/api/upload', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('PDF upload failed:', error);
      throw error;
    }
  };

export const getAllPdfs = async () => {
  try {
    const response = await axios.get(BASE_URL, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch PDFs:', error);
    throw error;
  }
};

export const getPdfsByWeek = async (weekNumber: number) => {
  try {
    const response = await axios.get(`${BASE_URL}?weekNumber=${weekNumber}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch PDFs by week:', error);
    throw error;
  }
};

export const getPdfsByAdmin = async (adminId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}?adminId=${adminId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch PDFs by admin:', error);
    throw error;
  }
};