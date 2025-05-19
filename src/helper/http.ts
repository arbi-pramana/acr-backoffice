import { notification } from "antd";
import axios from "axios";
import { getErrorMessage } from "./error-message";
import { storage } from "./local-storage";

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
    if (
      error.response.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      notification.error({ message: "Session expired, please relogin" });
      localStorage.removeItem("session");
      window.location.href = "/login";
    }

    const errorMessage = getErrorMessage(error.response.data);
    notification.error({ message: errorMessage });

    return error;
  }
);

export default http;
