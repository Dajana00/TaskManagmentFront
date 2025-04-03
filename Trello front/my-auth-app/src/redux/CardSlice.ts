import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Card } from "../types/Card";

const API_URL = "https://your-api-url.com/cards";

// Thunk za kreiranje kartice
export const addNewCard = createAsyncThunk(
  "cards/addNewCard",
  async (card: Omit<Card, "id">, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post<Card>(`${API_URL}/create`, card, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to create card");
    }
  }
);

const cardSlice = createSlice({
  name: "cards",
  initialState: {
    cards: [] as Card[],
    status: "idle",
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewCard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addNewCard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cards.push(action.payload);
      })
      .addCase(addNewCard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default cardSlice.reducer;
