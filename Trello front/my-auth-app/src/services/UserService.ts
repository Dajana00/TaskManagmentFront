import axios from "axios";
import { User } from "../redux/User";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.REACT_APP_API_URL+"/user";



export const getLoggedIn = async (): Promise<User> => {
    try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No access token found");

        const decodedToken: { sub: string; email: string } = jwtDecode(token);
        console.log("Decoded token: ", decodedToken);
        const userId = decodedToken.sub; 
    
        console.log("Logged-in user ID:", userId);

        // Slanje ID-a kroz URL
        const response = await axios.get<User>(`${API_URL}/getById/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
    }
};



export const getUserProjects = async (userId: number) => {
    try {
        const response = await axios.get(`http://localhost:5196/api/projects/getUserProjects/${userId}`);
        return response.data; 
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error; 
    }
};


export const createProject = async (projectDto:{id: number,name : string,ownerId: number}) => {
    try {
        const response = await axios.post(`http://localhost:5196/api/projects/create`,projectDto);
        return response.data; 
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error; 
    }
};