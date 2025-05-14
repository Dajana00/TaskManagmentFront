import { handleAxiosError } from "../utils/HandleAxiosError";
import axiosInstance from "../utils/AxiosIntance";
import { User } from "../redux/User";

const API_URL = process.env.REACT_APP_API_URL+"/userCard";


export const getCardNonMembers = async (cardId: number, projectId: number) :Promise<User[]>=> {
    try {
        const response = await axiosInstance.get<User[]>(API_URL+`/getNonMembers/${cardId}/${projectId}`);
        console.log("Servis metoda za dohvatanje non members: ",response);
        return response.data; 
    } catch (error) {
        console.error("Error fetching users:", error);
        handleAxiosError(error,"Unexpected error while fetching users by project id"); 
    }
};
export const getCardMembers = async (cardId: number) :Promise<User[]>=> {
    try {
        const response = await axiosInstance.get<User[]>(API_URL+`/getMembers/${cardId}`);
        console.log("Servis metoda za dohvatanje non members: ",response);
        return response.data; 
    } catch (error) {
        console.error("Error fetching users:", error);
        handleAxiosError(error,"Unexpected error while fetching users by project id"); 
    }
};
export const addOnCard = async (cardId: number, userId:number) => {
    try {
        const response = await axiosInstance.post(API_URL+`/addOnCard/${cardId}/${userId}`);
        return response.data; 
    } catch (error) {
        console.error("Error adding user on project:", error);
        handleAxiosError(error,"Unexpected error while adding user on project"); 
    }
};
