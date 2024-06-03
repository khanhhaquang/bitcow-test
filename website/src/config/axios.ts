import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://luckycowdev.bitsmiley.io/',
  headers: {
    'Cache-Control': 'no-cache'
  }
});

const axiosSetupInterceptors = (signature: string) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${signature}`;

      return config;
    },
    (err) => Promise.reject(err)
  );
};

export { axiosInstance, axiosSetupInterceptors };
