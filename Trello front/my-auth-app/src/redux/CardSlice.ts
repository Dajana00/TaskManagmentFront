import { createSlice, createAsyncThunk, PayloadAction, AsyncThunkAction, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Card, Status } from "../types/Card";
import { getAll, updateCardColumn } from "../services/CardService";

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

export const fetchAllCards = createAsyncThunk(
  "cards/fetchAllCards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAll();
      console.log("Kartoce sa beka: ", response);
      return response.data; // pod pretpostavkom da response ima data: Card[]

    } catch (error) {
      return rejectWithValue("Failed to fetch cards");
    }
  }
);

export const moveCardToNewColumn = createAsyncThunk(
    "cards/moveCardToNewColumn",
    async ({ cardId, newStatus }: { cardId: number, newStatus: string }, { rejectWithValue }) => {
        try {
            const updatedCard = await updateCardColumn(cardId, newStatus);
            dispatch(fetchAllCards());
            return updatedCard; // Vraćamo ažuriranu karticu iz odgovora sa backend-a
        } catch (error) {
            return rejectWithValue("Failed to move card");
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
  reducers: {
    setCards: (state, action: PayloadAction<Card[]>) => {
        state.cards = action.payload;
    }
  },
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
      })
      .addCase(fetchAllCards.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCards.fulfilled, (state, action: PayloadAction<Card[]>) => {
        state.status = "succeeded";
        state.cards = action.payload;
      })
      .addCase(fetchAllCards.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(moveCardToNewColumn.pending, (state) => {
        state.status = "loading";
      })
      .addCase(moveCardToNewColumn.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedCard = action.payload;
        const cardIndex = state.cards.findIndex(card => card.id === updatedCard.id);
        if (cardIndex !== -1) {
          state.cards[cardIndex] = updatedCard; // Ažuriraj karticu sa novim statusom
        }
      })
      
      .addCase(moveCardToNewColumn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setCards } = cardSlice.actions;

export default cardSlice.reducer;
function dispatch(arg0: AsyncThunkAction<any, void, { state?: unknown; dispatch?: ThunkDispatch<unknown, unknown, UnknownAction>; extra?: unknown; rejectValue?: unknown; serializedErrorType?: unknown; pendingMeta?: unknown; fulfilledMeta?: unknown; rejectedMeta?: unknown; }>) {
  throw new Error("Function not implemented.");
}

