import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Card } from "../types/Card";
import { updateCardColumn } from "../services/CardService";

interface MoveCardPayload {
  cardId: number;
  columnId: number;
}

interface CardState {
  cards: Card[];
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: CardState = {
  cards: [],
  status: "idle",
  error: null,
};

export const moveCard = createAsyncThunk(
  "cards/moveCard",
  async ({ cardId, columnId }: MoveCardPayload, { rejectWithValue }) => {
    try {
      const response = updateCardColumn(cardId,columnId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error moving card");
    }
  }
);

const cardSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(moveCard.fulfilled, (state, action: PayloadAction<MoveCardPayload>) => {
        const { cardId, columnId } = action.payload;
        const card = state.cards.find((c) => c.id === cardId);
        if (card) {
          card.columnId = columnId;
        }
      })
      .addCase(moveCard.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default cardSlice.reducer;
