import axios from "axios";
import { User } from "../redux/User";
import { jwtDecode } from "jwt-decode";
import { Backlog } from "../types/Backlog";

const API_URL = process.env.REACT_APP_API_URL+ "/backlog";



export const getBacklogById = async (id: number): Promise<Backlog> => {
    try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No access token found");
        const response = await axios.get<Backlog>(`${API_URL}/getById/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching board by id:", error);
        throw error;
    }
};
