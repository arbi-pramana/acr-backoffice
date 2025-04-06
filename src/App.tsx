import { notification } from "antd";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./helper/protected-route";
import Dashboard from "./pages/dashboard";
import KloterForm from "./pages/kloter-form";
import KYCForm from "./pages/kyc-form";
import Login from "./pages/login";

function App() {
  notification.config({
    placement: "topRight",
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kyc-form"
          element={
            <ProtectedRoute>
              <KYCForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kloter-form"
          element={
            <ProtectedRoute>
              <KloterForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kloter-form/:id"
          element={
            <ProtectedRoute>
              <KloterForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
