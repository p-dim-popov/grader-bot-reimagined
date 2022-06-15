import Axios, { AxiosRequestConfig } from "axios";

export const defaultAxiosServerConfig: AxiosRequestConfig = {
    // FIX: to be dynamic
    baseURL: `http://api:80`,
};

export const serverAxios = Axios.create(defaultAxiosServerConfig);
