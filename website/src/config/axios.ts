import axios from 'axios';
import { authToken, parseAuthToken } from 'utils/storage';

const axiosInstance = axios.create({
  baseURL: 'https://luckycow.bitsmiley.io/',
  headers: {
    'Cache-Control': 'no-cache'
  }
});
const campaignAxiosInstance = axios.create({
  baseURL: 'https://apis.bitsmiley.io/',
  headers: {
    'Cache-Control': 'no-cache'
  }
});

const axiosSetupInterceptors = (onResign: () => Promise<void>) => {
  axiosInstance.interceptors.request.clear();
  axiosInstance.interceptors.response.clear();

  axiosInstance.interceptors.request.use(
    (config) => {
      if (config.url === 'user/login') return config;

      const { token } = parseAuthToken(authToken.get());

      if (!token) {
        const controller = new AbortController();
        config.signal = controller.signal;
        controller.abort('No token found');

        return config;
      }

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
        onResign().then(() => axiosInstance(originalRequest));
      }

      return Promise.reject(err);
    }
  );
};

export { axiosInstance, campaignAxiosInstance, axiosSetupInterceptors };
