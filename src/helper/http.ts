import axios from "axios";
import { storage } from "./local-storage";
import { notification } from "antd";

const http = axios.create({ baseURL: import.meta.env.VITE_BASEURL });

axios.defaults.headers.common.Authorization = `Bearer ${storage.getItem(
  "token"
)}`;

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("response error", error.message);

    notification.success({
      message: error.message ?? "Unknown Error",
      placement: "bottomLeft",
    });
  }
);

export default http;
