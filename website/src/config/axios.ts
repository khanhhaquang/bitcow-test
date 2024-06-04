import axios from 'axios';
import { authToken, parseAuthToken } from 'utils/storage';

const axiosInstance = axios.create({
  baseURL: 'https://luckycowdev.bitsmiley.io/',
  headers: {
    'Cache-Control': 'no-cache'
  }
});

const axiosSetupInterceptors = (onResign: () => Promise<void>) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const { token } = parseAuthToken(authToken.get());
      config.headers.Authorization = `Bearer ${token}`;

      return config;
    },
    (err) => Promise.reject(err)
  );

  axiosInstance.interceptors.response.use(
    (res) => {
      if (res.data?.data?.message === 'invalid token') {
        onResign();
      }
      return res;
    },
    (err) => {
      const status = err.response?.status;
      // If not Unauthorized error
      // Reject error
      if (status !== 401) {
        onResign();
        return Promise.reject(err);
      }

      return Promise.reject(err);
    }
  );
};

export { axiosInstance, axiosSetupInterceptors };
