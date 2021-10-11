import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: '',
  user: {}
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      return {...state, token: action.payload}
    },
    setUserInfo: (state, action) => {
      return {...state, user: action.payload}
    }
  }
})

const { reducer, actions } = authSlice;
export const { setToken, setUserInfo } = actions;
export default reducer; 