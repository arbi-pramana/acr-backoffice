import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as AppAntd, ConfigProvider } from "antd";
import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import "../src/index.css";

const MountWithProviders = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 0 } },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
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
          <AppAntd />
          {children}
        </ConfigProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default MountWithProviders;
