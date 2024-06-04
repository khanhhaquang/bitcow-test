import axios from 'axios';
import { authToken, parseAuthToken } from 'utils/storage';

const axiosInstance = axios.create({
  baseURL: 'https://luckycowdev.bitsmiley.io/',
  headers: {
    'Cache-Control': 'no-cache'
  }
});

const axiosSetupInterceptors = (onResign: () => Promise<void>) => {
  axiosInstance.interceptors.request.clear();
  axiosInstance.interceptors.response.clear();

  axiosInstance.interceptors.request.use(
    (config) => {
      const { token } = parseAuthToken(authToken.get());
      config.headers.Authorization = `Bearer ${token}`;

      return config;
    },
    (err) => Promise.reject(err)
  );

  axiosInstance.interceptors.response.use(
    (res) => res,
    (err) => {
      const status = err.response?.status;
      const originalRequest = err.config;

      // If not Unauthorized error
      if (status === 401) {
        authToken.clear();
        return onResign().then(() => axiosInstance(originalRequest));
      }

      return Promise.reject(err);
    }
  );
};

export { axiosInstance, axiosSetupInterceptors };
