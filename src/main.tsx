import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as AppAntd, ConfigProvider } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 0 } },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      {/* { "primary-400": "#C475D6" } */}
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#9f4abc",
            colorPrimaryActive: "#7e36a1",
            colorPrimaryBg: "#fbddfa",
          },
          components: {
            Input: {
              borderRadius: 20,
            },
            DatePicker: {
              borderRadius: 20,
            },
            Button: {
              borderRadius: 20,
              defaultColor: "#9f4abc",
              defaultBorderColor: "#9f4abc",
              fontWeight: 600,
            },
            Select: {
              borderRadius: 20,
            },
            Form: {
              labelColor: "#6E6E78",
            },
            Modal: {
              colorPrimary: "#9f4abc",
              colorPrimaryActive: "#7e36a1",
              colorPrimaryBg: "#fbddfa",
            },
          },
        }}
      >
        <AppAntd>
          <App />
        </AppAntd>
      </ConfigProvider>
    </StrictMode>
  </QueryClientProvider>
);
