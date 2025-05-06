import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/users'; // Changed from /api/auth/users

// Login function (keep this if you have a separate auth endpoint)
export const userLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/auth/login", // This should match your actual login endpoint
      { email, password },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/users', {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Create a new user
export const createUser = async (email: string, password: string, role: string, teamId?: number) => {
  try {
    const response = await axios.post(
      API_BASE_URL,
      { email, password, role, teamId },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update an existing user
export const updateUser = async (id: number, email: string, password: string, role: string, teamId?: number) => {
  try {
    const response = await axios.put(
      'http://localhost:3000/api/users',
      { id, email, password, role, teamId },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (id: number) => {
  try {
    const response = await axios.delete(
      API_BASE_URL,
      {
        data: { id },
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Update password (assuming you have a separate endpoint for this)
export const updatePassword = async (userId: number, currentPassword: string, newPassword: string) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/users/change-password", // Adjust this to match your actual endpoint
      { userId, currentPassword, newPassword },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};