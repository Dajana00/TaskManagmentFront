import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/AuthService";
import { useForm } from "../../hooks/useForm";
import { validateRegister } from "../../utils/validation";
import InputField from "../common/InputField";
import './LoginPage.css'
import axios from "axios";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");


  const { values, handleChange, handleSubmit: formSubmit, errors , touchedFields} = useForm({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    phoneNumber: "",
  }, validateRegister);

  const handleSubmit = (e: React.FormEvent) => {
    formSubmit(e, async () => {
      try {
        setLoading(true);
        await registerUser(values);
        alert("Registration successful! Please log in.");
        navigate("/login");
      } catch (error:unknown) {
        if (axios.isAxiosError(error)) {  // Proveri da li je error Axios greška
          const errorMessage = error.response?.data?.message || "An unknown error occurred"; // Greška sa backend-a
          console.log(errorMessage);
          throw new Error(errorMessage);  // Baci grešku
      } else {
          throw new Error("An unexpected error occurred");  // Generalna greška ako nije iz Axios-a
      }
      } finally {
        setLoading(false);
      }
    });
  };

  const method = async () => {

  };

  useEffect(() => {
    console.log('Pocetni ispis');
  }, []);

  useEffect(() => {
    console.log('Greska');

  }, [serverError]);

  return (
    <div className="wrapper">
      <h2>Register</h2>
      {serverError && <p className="error-message">{serverError}</p>}
      <form onSubmit={handleSubmit}>
      <div className="input-box">
        <InputField label="" placeholder="Fist name" type="text" name="firstName" value={values.firstName}
                    error={touchedFields.firstName ? errors.firstName : ""} onChange={handleChange} />
        </div> <div className="input-box">
        <InputField label="" type="text" placeholder="Last name" name="lastName" value={values.lastName}
                   error={touchedFields.lastName ? errors.lastName : ""} onChange={handleChange} />
        </div> <div className="input-box">
        <InputField label="" type="email" placeholder="Email" name="email" value={values.email} 
                  error={touchedFields.email ? errors.email : ""} onChange={handleChange} />
        </div> <div className="input-box">
        <InputField label="" type="text" placeholder="Username" name="username" value={values.username} 
                 error={touchedFields.username ? errors.username : ""} onChange={handleChange} />
        </div> <div className="input-box">
        <InputField label="" type="password" placeholder="Password" name="password" value={values.password}
                 error={touchedFields.password ? errors.password : ""} onChange={handleChange} />
        </div> <div className="input-box">
        <InputField label="" type="text" placeholder="Phone number" name="phoneNumber" value={values.phoneNumber} 
                error={touchedFields.phoneNumber ? errors.phoneNumber : ""} onChange={handleChange} />
        </div>
        <button type="submit" disabled={loading || !!Object.keys(errors).length}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
