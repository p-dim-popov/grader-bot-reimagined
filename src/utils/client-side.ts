import Axios, { AxiosRequestConfig } from 'axios';

export const defaultAxiosClientConfig: AxiosRequestConfig = {
  baseURL: '/api',
};

export const clientAxios = Axios.create(defaultAxiosClientConfig);
