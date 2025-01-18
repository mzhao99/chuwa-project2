import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser, logoutUser, verifyRegistrationLink } from "./authAPI";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginUser(credentials);
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await registerUser(userData);
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
      localStorage.removeItem("token");
    } catch (error) {
      return rejectWithValue(error.response?.data || "Logout failed");
    }
  }
);

export const verifyLink = createAsyncThunk(
  "auth/verifyLink",
  async (token, { rejectWithValue }) => {
    try {
      const data = await verifyRegistrationLink(token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Link verification failed");
    }
  }
);
