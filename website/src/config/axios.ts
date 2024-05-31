import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'ec2-13-213-40-242.ap-southeast-1.compute.amazonaws.com:8866/', //TODO:: add base url
  headers: {
    accept: 'application/json',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json'
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
