import axios from 'axios';

export const userLogin = async (email, password) => {
    try {
        const response = await axios.post(
            "http://localhost:3000/api/auth/login",
            { email, password },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );

        return response;
    } catch (error) {
        console.error('Error removing product:', error);
        throw error;
    }
};