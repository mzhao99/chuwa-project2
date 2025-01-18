import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data; 
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data; 
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed';
  }
};

export const logoutUser = async () => {
  try {
    await axios.post(`${API_BASE_URL}/auth/logout`);
  } catch (error) {
    throw error.response?.data?.message || 'Logout failed';
  }
};

export const verifyRegistrationLink = async(token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/register/${token}`);
    return response.data; 
  } catch (error) {
    throw error.response?.data?.message || 'Verification failed';
  }
}
