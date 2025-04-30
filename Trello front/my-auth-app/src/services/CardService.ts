import { Card } from "../types/Card";
import axiosInstance from "../utils/AxiosIntance";
import { handleAxiosError } from "../utils/HandleAxiosError";

const API_URL = process.env.REACT_APP_API_URL + "/card";  

export const createCard = async (card: Omit<Card, "id">): Promise<Card> => {
    try {
        const response = await axiosInstance.post<Card>(API_URL+'/create', card);
        return response.data; 
    } catch (error) {
        console.error("Failed to create card:", error);
        handleAxiosError(error,"Failed to create card");
    }
};
export const updateCardColumn = async (cardId: number, newStatus: string) => {
    try {
        const response = await axiosInstance.put(`${API_URL}/move`, { 
            cardId: cardId, 
            newStatus: newStatus 
        });
        console.log("Odgovor kada udje u metodu updateCardColumn:",response);
        return response.data;
    } catch (error) {
        console.error("Failed to update card column:", error);
        handleAxiosError(error,"Failed to update card column:");
    }
};


export const getByBoardId = async (boardId: number) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/getByBoardId/`+boardId);
        return response.data; 
    } catch (error) {
        console.error("Failed to get all cards:", error);
        handleAxiosError(error,"Unexpected error while getting cards by board id "+boardId);
    }
};
export const getByUserStoryId = async (userStoryId: number) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/getByUserStoryId/`+ userStoryId);
        return response.data; 
    } catch (error) {
        console.error("Failed to get by user story id:", error);
        handleAxiosError(error,"Unexpected error while getting cards by user story id:"+userStoryId);
    }
};

export const addToActiveSprint = async (id: number) => {
    try {
        const response = await axiosInstance.put(`${API_URL}/addToActiveSprint/`+ id);
        console.log("Odgovor kada udje u metodu addToActiveSprint:",response);
        return response.data; 
    } catch (error) {
        console.error("Failed to add card to active sprint:", error);
        handleAxiosError(error,"Unexpected error while adding card to active sprint")
    }
};