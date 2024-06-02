import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://ec2-13-213-40-242.ap-southeast-1.compute.amazonaws.com:8866/',
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
