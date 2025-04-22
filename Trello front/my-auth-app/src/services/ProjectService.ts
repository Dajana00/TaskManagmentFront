import axios from "axios";
import { User } from "../redux/User";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.REACT_APP_API_URL+"/projects/";



export const getUserProjects = async (userId: number) => {
    try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No access token found");
        const response = await axios.get(API_URL+`getUserProjects/${userId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, 
                },
            }
        );
        return response.data; 
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error; 
    }
};


export const createProject = async (projectDto:{id: number,name : string,ownerId: number}) => {
    try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No access token found");
        const response = await axios.post(API_URL+`create`,projectDto,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, 
                },
            }
        );
        return response.data; 
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error; 
    }
};