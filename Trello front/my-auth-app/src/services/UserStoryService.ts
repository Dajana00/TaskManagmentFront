import { UserStory } from "../types/UserStory";
import axiosInstance from "../utils/AxiosIntance";
import { handleAxiosError } from "../utils/HandleAxiosError";

const API_URL = process.env.REACT_APP_API_URL + "/userStory";  

export const createUserStory = async (card: Omit<UserStory, "id">): Promise<UserStory> => {
    try {
        const response = await axiosInstance.post<UserStory>(API_URL+'/create', card,);
        return response.data; 
    } catch (error) {
        console.error("Failed to create UserStory:", error);
        handleAxiosError(error,"Unexpected error while creating user story");
    }
};

export const getByBacklogId = async (backlogId: number): Promise<UserStory[]> => {
    try {
        const response = await axiosInstance.get<UserStory[]>(API_URL+'/getByBacklogId/'+ backlogId);
        return response.data; 
    } catch (error) {
        console.error("Failed to get UserStory by backlogId:", error);
        handleAxiosError(error,"Failed to get UserStory by backlogId")
    }
};
export const getById = async (id: number): Promise<UserStory> => {
    try {
        const response = await axiosInstance.get<UserStory>(API_URL+'/getById/'+ id);
        return response.data; 
    } catch (error) {
        console.error("Failed to get UserStory by id:", error);
        handleAxiosError(error,"Failed to get UserStory by id")
    }
};