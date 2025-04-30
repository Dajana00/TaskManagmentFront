import { Backlog } from "../types/Backlog";
import axiosInstance from "../utils/AxiosIntance";
import { handleAxiosError } from "../utils/HandleAxiosError";

const API_URL = process.env.REACT_APP_API_URL+ "/backlog";

export const getBacklogById = async (id: number): Promise<Backlog> => {
    try {
        const response = await axiosInstance.get<Backlog>(`${API_URL}/getById/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching board by id:", error);
        handleAxiosError(error,"Unexpected error fetching backlog by id: "+id);
    }
};
