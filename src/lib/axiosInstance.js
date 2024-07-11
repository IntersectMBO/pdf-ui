import axios from 'axios';
import { getDataFromSession } from './utils';

let axiosInstance = axios.create();

export const setAxiosBaseURL = (baseURL) => {
    axiosInstance.defaults.baseURL = baseURL || 'https://dev.api.pdf.gov.tools';
};

axiosInstance.interceptors.request.use((config) => {
    const token =
        typeof window !== 'undefined' && getDataFromSession('pdfUserJwt');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
