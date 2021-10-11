import axios from 'axios';
import { store } from "app/store";
import queryString from 'query-string';
const baseURL = 'https://pms.wechoom.com/api/';

const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(
  async (config) => {
    const accessToken = store.getState().auth.token;
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default axiosClient;
