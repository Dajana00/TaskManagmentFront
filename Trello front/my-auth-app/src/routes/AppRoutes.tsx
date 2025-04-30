// routes/AppRoutes.tsx
import { Routes as Routes, Route, Navigate } from "react-router-dom";
import SignUp from "../components/pages/SignUp";
import Login from "../components/pages/Login";
import Dashboard from "../components/pages/Dashboard";

const AppRoutes = () => {
  const accessToken = localStorage.getItem("accessToken");

  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={accessToken ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    
  );
};

export default AppRoutes;
