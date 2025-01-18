// import {login, signup } from '../../api/auth';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  token: null,
  currentUser: null,
  loading: false,
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, {rejectWithValue}) => {
    try {
      // return await login(credentials);
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      console.log(err.response);
      return rejectWithValue(err.response.data);
    }
  }
);

export const signupUser = createAsyncThunk(
  'user/signup',
  async (signupFormData, {rejectWithValue}) => {
    try {
      // return await signup(signupFormData);
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      console.log(err.response);
      return rejectWithValue(err.response.data);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isAuthenticated = !!action.payload;
      state.currentUser = action.payload.user;
    },
    clearUser: (state, action) => {
      localStorage.removeItem('token');
      state.isAuthenticated = false;
      state.currentUser = null;
    },
    resetEmailLookupStatus: (state) => {
      state.lookupEmail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        localStorage.setItem('token', action.payload.token);
        state.token = action.payload.token;
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
      });

    builder
      .addCase(signupUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const {setUser, clearUser} = userSlice.actions;
export default userSlice;
