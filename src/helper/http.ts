import axios from "axios";
import { storage } from "./local-storage";
import { notification } from "antd";

const http = axios.create({ baseURL: "" });

axios.defaults.headers.common.Authorization = `Bearer ${storage.getItem(
  "token"
)}`;

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("response error", error);

    notification.error({
      message: error.response.data.message,
    });
  }
);

export default http;
