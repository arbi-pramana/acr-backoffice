import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, App as AppAntd } from "antd";

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
        }}
      >
        <AppAntd>
          <App />
        </AppAntd>
      </ConfigProvider>
    </StrictMode>
  </QueryClientProvider>
);
