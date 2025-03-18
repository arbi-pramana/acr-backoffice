import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 0 } },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <ConfigProvider theme={{ token: { colorPrimary: "black" } }}>
        <App />
      </ConfigProvider>
    </StrictMode>
  </QueryClientProvider>
);
