import { handleAxiosError } from "../utils/HandleAxiosError";
import axiosInstance from "../utils/AxiosIntance";

const API_URL = process.env.REACT_APP_API_URL+"/projects/";

export const getUserProjects = async (userId: number) => {
    try {
        const response = await axiosInstance.get(API_URL+`getUserProjects/${userId}`);
        return response.data; 
    } catch (error) {
        console.error("Error fetching projects:", error);
        handleAxiosError(error,"Unexpected error while getting user projects"); 
    }
};


export const createProject = async (projectDto:{id: number,name : string,ownerId: number}) => {
    try {
        const response = await axiosInstance.post(API_URL+`create`,projectDto);
        return response.data; 
    } catch (error) {
        console.error("Error fetching projects:", error);
        handleAxiosError(error,"Unexpected error while creating project"); 
    }
};