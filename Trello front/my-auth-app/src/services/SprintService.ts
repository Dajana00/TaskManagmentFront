import { Sprint } from "../types/Sprint";
import { handleAxiosError } from "../utils/HandleAxiosError";
import axiosInstance from "../utils/AxiosIntance";

const API_URL = process.env.REACT_APP_API_URL + "/sprint";  

export const createSprint = async (sprint: Omit<Sprint, "id">): Promise<Sprint> => {
    try {
        const response = await axiosInstance.post<Sprint>(API_URL+'/create', sprint);
        return response.data; 
    } catch (error) {
        handleAxiosError(error,"Unexpected error occurred while creating sprint.");
    }
};

export const getByProjectId = async (projectId: number): Promise<Sprint[]> => {
    try {
        const response = await axiosInstance.get<Sprint[]>(API_URL+'/getByProjectId/'+ projectId);
        return response.data; 
    } catch (error) {
        console.error("Failed to featch sprints by projct id:", error);
        handleAxiosError(error,"$Unexpected error occurred while getting sprint by project id ."+projectId);

    }
};

export const activateSprint = async (id: number) : Promise<Sprint>=> {
    try {
console.log("Usao u metodu za aktivaciji: ", id);
        const response = await axiosInstance.put<Sprint>(API_URL+'/activateSprint/'+ id);
        return response.data; 
    } catch (error) {
        handleAxiosError(error,"Unexpected error occurred while activating sprint with id."+id);
    }
};

export const completeSprint = async (boardId:number) : Promise<Sprint>=> {
    try {
        const response = await axiosInstance.put<Sprint>(API_URL+'/complete/'+boardId);
        return response.data; 
    } catch (error) {
        handleAxiosError(error,"Unexpected error occurred while completing sprint with board id."+boardId);
    }
};