import axios from "axios";
import { User } from "../redux/User";
import { jwtDecode } from "jwt-decode";
import { Board } from "../types/Board";

const API_URL = process.env.REACT_APP_API_URL+ "/boards";



export const getBoardById = async (id: number): Promise<Board> => {
    try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No access token found");
        const response = await axios.get<Board>(`${API_URL}/getById/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching board by id:", error);
        throw error;
    }
};
