import { User } from "../redux/User";
import { jwtDecode } from "jwt-decode";
import { handleAxiosError } from "../utils/HandleAxiosError";
import axiosInstance from "../utils/AxiosIntance";

const API_URL = process.env.REACT_APP_API_URL+"/user";

export const getLoggedIn = async (): Promise<User> => {
    try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No access token found");
        const decodedToken: { sub: string; email: string } = jwtDecode(token);
        const userId = decodedToken.sub; 
        const response = await axiosInstance.get<User>(`${API_URL}/getById/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user info:", error);
        handleAxiosError(error, "Error fetching user info");
    }
};



