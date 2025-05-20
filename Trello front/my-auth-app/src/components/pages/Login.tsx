import React, { JSX, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthTokens } from "../../redux/AuthSlice";
import { loginUser } from "../../services/AuthService";
import { useForm } from "../../hooks/useForm";
import { validateLogin } from "../../utils/validation";
import InputField from "../common/InputField";
import '../pages/LoginPage.css';
import {FaLock, FaUser} from "react-icons/fa";



const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  
  
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const { values, handleChange, handleSubmit: formSubmit, errors } = useForm<{ username: string; password: string }>(
    { username: "", password: "" },
    validateLogin
  );

  const handleSubmit = (e: React.FormEvent) => {
    formSubmit(e, async () => {
      try {
        setLoading(true);
        const response = await loginUser({ username: values.username, password: values.password });
        console.log("Access token u login.tsx ",response.value.accessToken);
        console.log("Refresh token u login.tsx ",response.value.refreshToken);
        console.log("ODgovor sa beka: ", response);
        dispatch(setAuthTokens({ accessToken: response.value.accessToken, refreshToken: response.value.refreshToken }));

        localStorage.setItem("accessToken", response.value.accessToken);
        localStorage.setItem("refreshToken", response.value.refreshToken);
   
        alert("Login successful!");
        navigate("/dashboard");
      } catch (error) {
        setServerError("Invalid username or password.");
      } finally {
        setLoading(false);
      }
    });
  };

  return (
  
    <div className="auth-wrapper">
  <h1>Login</h1>
  {serverError && <p className="auth-error-message">{serverError}</p>}
  <form onSubmit={handleSubmit} className="auth-container">
    <div className="auth-input-box">
      <InputField
        label=""
        type="text"
        placeholder="Username"
        name="username"
        value={values.username}
        error={errors.username}
        onChange={handleChange}
      />
      <FaUser className="auth-icon" />
    </div>
    <div className="auth-input-box">
      <InputField
        label=""
        type="password"
        placeholder="Password"
        name="password"
        value={values.password}
        error={errors.password}
        onChange={handleChange}
      />
      <FaLock className="auth-icon" />
    </div>
    <div className="space"></div>
    <button
      type="submit"
      disabled={loading || !!errors.username || !!errors.password}
      className={`auth-button ${loading ? "disabled" : ""}`}
    >
      {loading ? "Logging in..." : "Login"}
    </button>
  </form>
  <div className="auth-register-link">
    <p>
      Don't have an account?
      <a href="/signup"> Register</a>
    </p>
  </div>
</div>

  
  );
};

export default Login;
