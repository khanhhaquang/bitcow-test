import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '', //TODO:: add base url
  headers: {
    accept: 'application/json',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json'
  }
});

export { axiosInstance };
