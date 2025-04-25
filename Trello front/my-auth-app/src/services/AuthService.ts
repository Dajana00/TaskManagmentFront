import axios from "axios";
import { handleAxiosError } from "../utils/HandleAxiosError";

const API_URL = process.env.REACT_APP_API_URL;
console.log("API URL ", API_URL);


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
       handleAxiosError(error,"error registering user");
    }
};
