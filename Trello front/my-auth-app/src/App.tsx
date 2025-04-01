import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/pages/Dashboard";
import Login from "./components/pages/Login";
import SignUp from "./components/pages/SignUp";
import "./index.css";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />   {/* Dodajemo početnu stranicu */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;
