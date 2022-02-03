import Axios, { AxiosRequestConfig } from 'axios';

export const defaultAxiosServerConfig: AxiosRequestConfig = {
  baseURL:
    process.env.NODE_ENV === 'development' ? 'http://localhost:5228' : '',
};

export const serverAxios = Axios.create(defaultAxiosServerConfig);
