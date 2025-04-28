import { notification } from "antd";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./helper/protected-route";
import AccountForm from "./pages/account-form";
import AccountInstallments from "./pages/account-form-installment";
import Dashboard from "./pages/dashboard";
import KloterForm from "./pages/kloter-form";
import KYCForm from "./pages/kyc-form";
import Login from "./pages/login";
// import utc from "dayjs/plugin/utc";
// import timezone from "dayjs/plugin/timezone";
// import dayjs from "dayjs";

function App() {
  notification.config({
    placement: "topRight",
  });
  // dayjs.extend(utc);
  // dayjs.extend(timezone);
  // dayjs.tz.setDefault(dayjs.tz.guess());
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
        <Route
          path="/account-form/:id"
          element={
            <ProtectedRoute>
              <AccountForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account-form/:id/:catalogid"
          element={
            <ProtectedRoute>
              <AccountInstallments />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
