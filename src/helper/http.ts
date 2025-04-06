import axios from "axios";
import { storage } from "./local-storage";
import { notification } from "antd";

const http = axios.create({ baseURL: import.meta.env.VITE_APP_BASE_URL });

http.interceptors.request.use((req) => {
  if (storage.getItem("session", true)?.bearerToken) {
    req.headers.Authorization = `Bearer ${
      storage.getItem("session", true)?.bearerToken
    }`;
  }
  return req;
});

http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    notification.error({
      message: error.response.data.message ?? "Unknown Error",
      placement: "bottomRight",
    });
    if (
      error.response.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      notification.error({
        message: "Session expired, please relogin",
        placement: "bottomRight",
      });
      localStorage.removeItem("session");
      window.location.href = "/login";
    }
    return error;
  }
);

export default http;
