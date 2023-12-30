import { notification } from "antd";
import axios from "axios";
import { deleteToken, getToken } from "./cookies";

const makeRequest = async (url: string, options?: any) => {
  try {
    return await axios(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${getToken()}`,
      },
    });
  } catch (error: any) {
    let errorMessage = error?.message;

    const dataMsg = error?.response?.data?.message;
    if (dataMsg) {
      if (Array.isArray(dataMsg)) errorMessage = dataMsg[0];
      else errorMessage = dataMsg;
    }

    notification.error({
      message: errorMessage,
      duration: 3,
    });

    if (error?.response?.status === 401) {
      deleteToken();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
  }
};

const getFileUrl = (image: string) => {
  return `${process.env.NEXT_PUBLIC_API_URL}${image}`;
};

const getFileName = (url: string) => {
  return url.substring(url.lastIndexOf("/") + 1);
};

export { makeRequest, getFileUrl, getFileName };
