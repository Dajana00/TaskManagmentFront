import axios from "axios";
import { Sprint } from "../types/Sprint";

const API_URL = process.env.REACT_APP_API_URL + "/sprint";  

export const createSprint = async (sprint: Omit<Sprint, "id">): Promise<Sprint> => {
    try {
        console.log("Proslijedjeni id projekta za kreiranje: ", sprint.projectId);
        const token = localStorage.getItem("token");  

        const response = await axios.post<Sprint>(API_URL+'/create', sprint, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, 
            },
        });

        return response.data; 
    } catch (error) {
        console.error("Failed to create sprint:", error);
        throw new Error("Failed to create sprint");
    }
};

export const getByProjectId = async (projectId: number): Promise<Sprint[]> => {
    try {
        const token = localStorage.getItem("token");  

        const response = await axios.get<Sprint[]>(API_URL+'/getByProjectId/'+ projectId, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, 
            },
        });

        return response.data; 
    } catch (error) {
        console.error("Failed to featch sprints by projct id:", error);
        throw new Error("Failed to featch sprints by projct id:");
    }
};

export const activateSprint = async (id: number) : Promise<Sprint>=> {
    try {
        const token = localStorage.getItem("token");  
console.log("Usao u metodu za aktivaciji: ", id);
        const response = await axios.put<Sprint>(API_URL+'/activateSprint/'+ id, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, 
            },
        });

        return response.data; 
    } catch (error) {
        console.error("Failed to activate sprint", error);
        throw new Error("Failed to activate sprint");
    }
};