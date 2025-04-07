import axios from "axios";
import { UserStory } from "../types/UserStory";

const API_URL = process.env.REACT_APP_API_URL + "/userStory";  

export const createUserStory = async (card: Omit<UserStory, "id">): Promise<UserStory> => {
    try {
        const token = localStorage.getItem("token");  

        const response = await axios.post<UserStory>(API_URL+'/create', card, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, 
            },
        });

        return response.data; 
    } catch (error) {
        console.error("Failed to create UserStory:", error);
        throw new Error("Failed to create UserStory");
    }
};

export const getByBacklogId = async (backlogId: number): Promise<UserStory[]> => {
    try {
        const token = localStorage.getItem("token");  

        const response = await axios.get<UserStory[]>(API_URL+'/getByBacklogId/'+ backlogId, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, 
            },
        });

        return response.data; 
    } catch (error) {
        console.error("Failed to get UserStory by backlogId:", error);
        throw new Error("Failed to get UserStory by backlogId");
    }
};