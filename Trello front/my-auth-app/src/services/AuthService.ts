import axios from "axios";
import { LoginFormData } from "../types/loginFormData.types";
import { User } from "../types/userTypes";

const API_URL = process.env.REACT_APP_API_URL;
console.log("API URL ", API_URL)


export const loginUser = async (credentials: { username: string; password: string }) => {
    console.log("API Url :",API_URL);
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data; // Očekuje AuthResponseDto { accessToken, refreshToken }
  };

  
  export const registerUser = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    phoneNumber: string;
}) => {
    try {
        const response = await axios.post(`${API_URL}/auth/signup`, userData);
        return response.data; // Očekuje AuthResponseDto { accessToken, refreshToken }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || "An unknown error occurred"; 
            throw new Error(errorMessage); 
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};
