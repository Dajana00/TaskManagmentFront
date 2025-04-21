import axios from "axios";
import { Card } from "../types/Card";

const API_URL = process.env.REACT_APP_API_URL + "/card";  

export const createCard = async (card: Omit<Card, "id">): Promise<Card> => {
    try {
        const token = localStorage.getItem("token");  

        const response = await axios.post<Card>(API_URL+'/create', card, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, 
            },
        });

        return response.data; 
    } catch (error) {
        console.error("Failed to create card:", error);
        throw new Error("Failed to create card");
    }
};
export const updateCardColumn = async (cardId: number, newStatus: string) => {
    try {
        const token = localStorage.getItem("token"); 
        console.log("Prosledjeni status u service: ",newStatus);
        const response = await axios.put(`${API_URL}/move`, { 
            cardId: cardId, 
            newStatus: newStatus 
        },
    {  headers: { Authorization: `Bearer ${token}` },});
        console.log("Odgovor kada udje u metodu updateCardColumn:",response);
        return response.data;
    } catch (error) {
        console.error("Failed to update card column:", error);
    }
};


export const getByBoardId = async (boardId: number) => {
    try {
        const token = localStorage.getItem("token"); 
        const response = await axios.get(`${API_URL}/getByBoardId/`+boardId,
    {  headers: { Authorization: `Bearer ${token}` },});
        console.log("Odgovor kada udje u metodu GetALl:",response);
        return response.data; 
    } catch (error) {
        console.error("Failed to get all cards:", error);
    }
};
export const getByUserStoryId = async (userStoryId: number) => {
    try {
        const token = localStorage.getItem("token"); 
        const response = await axios.get(`${API_URL}/getByUserStoryId/`+ userStoryId,
    {  headers: { Authorization: `Bearer ${token}` },});
        console.log("Odgovor kada udje u metodu getByUserStoryId:",response);
        return response.data; 
    } catch (error) {
        console.error("Failed to get by user story id:", error);
    }
};

export const addToActiveSprint = async (id: number) => {
    try {
        const token = localStorage.getItem("token"); 
        const response = await axios.put(`${API_URL}/addToActiveSprint/`+ id,
    {  headers: { Authorization: `Bearer ${token}` },});
        console.log("Odgovor kada udje u metodu addToActiveSprint:",response);
        return response.data; 
    } catch (error) {
        console.error("Failed to add card to active sprint:", error);
    }
};