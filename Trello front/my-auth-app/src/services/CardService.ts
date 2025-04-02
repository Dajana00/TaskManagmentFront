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
export const updateCardColumn = async (cardId: number, columnId: number) => {
    try {
        const token = localStorage.getItem("token"); 
        // Poslati oba parametra (cardId i columnId) kao objekat u PUT request
        const response = await axios.put(`${API_URL}/move`, { 
            cardId: cardId, 
            columnId: columnId 
        },
    {  headers: { Authorization: `Bearer ${token}` },});
        console.log("Odgovor kada udje u metodu updateCardColumn:",response);
        return response.data; // Ako je potrebno, možeš obraditi odgovor od servera
    } catch (error) {
        console.error("Failed to update card column:", error);
    }
};


