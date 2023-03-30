import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const BASE_URL = 'http://localhost:8001/api';

export const httpGet = async <T>({
  url,
  params,
  headers,
  ...rest
}: AxiosRequestConfig): Promise<T> => {
  const apiUrl = BASE_URL + url;
  const response: AxiosResponse<T> = await axios.get(apiUrl, {
    params,
    headers,
    ...rest,
  });

  return response.data;
};

export const httpPost = async <T>({
  url,
  data,
  ...rest
}: AxiosRequestConfig): Promise<T> => {
  const apiUrl = BASE_URL + url;
  const response: AxiosResponse<T> = await axios.post(apiUrl, data, rest);

  return response.data;
};

export const httpPatch = async <T>({
  url,
  data,
  ...rest
}: AxiosRequestConfig): Promise<T> => {
  const apiUrl = BASE_URL + url;
  const response: AxiosResponse<T> = await axios.patch(apiUrl, data, rest);

  return response.data;
};
