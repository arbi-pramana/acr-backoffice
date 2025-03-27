import axios from "axios";
import { storage } from "./local-storage";
import { notification } from "antd";

const http = axios.create({ baseURL: import.meta.env.VITE_APP_BASE_URL });

// axios.defaults.headers.common.Authorization = `Bearer ${
//   storage.getItem("token", true)?.bearerToken
// }`;

http.interceptors.request.use((req) => {
  if (storage.getItem("token", true)?.bearerToken) {
    req.headers.Authorization = `Bearer ${
      storage.getItem("token", true)?.bearerToken
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
      message: error.message ?? "Unknown Error",
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
