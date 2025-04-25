import { Board } from "../types/Board";
import axiosInstance from "../utils/AxiosIntance";
import { handleAxiosError } from "../utils/HandleAxiosError";

const API_URL = process.env.REACT_APP_API_URL+ "/boards";

export const getBoardById = async (id: number): Promise<Board> => {
    try {
        const response = await axiosInstance.get<Board>(`${API_URL}/getById/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching board by id:"+id, error);
        handleAxiosError(error,"Error fetching board by id:"+id);
    }
};
