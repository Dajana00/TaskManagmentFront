import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "../components/pages/SignUp";
import Login from "../components/pages/Login";
import Dashboard from "../components/pages/Dashboard";

const AppRoutes = () => {
    const accessToken = localStorage.getItem("accessToken"); // Provera da li je korisnik ulogovan

    return (
        <Router>
            <Routes>
                {/* Ako korisnik nije prijavljen, ide na SignUp */}
                

                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />

                <Route path="/dashboard" element={accessToken ? <Dashboard /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
