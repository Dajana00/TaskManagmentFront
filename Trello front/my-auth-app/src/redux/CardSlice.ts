import { createSlice, createAsyncThunk, PayloadAction, AsyncThunkAction, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { Card, Status } from "../types/Card";
import { getByBoardId, updateCardColumn, createCard, addToActiveSprint } from "../services/CardService";

export const addNewCard = createAsyncThunk(
  "cards/addNewCard",
  async (card: Omit<Card, "id">, { rejectWithValue }) => {
    try {
      const response = await createCard(card);
      return response;
    } catch (error) {
      return rejectWithValue("Failed to create card");
    }
  }
);

export const fetchAllCards = createAsyncThunk(
  "cards/fetchAllCards",
  async (boardId: number, { rejectWithValue }) => {
    try {
      const response = await getByBoardId(boardId);
      console.log("Kartoce sa beka: ", response);
      return response.data;

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
            //dispatch(fetchAllCards());
            return updatedCard; // Vraćamo ažuriranu karticu iz odgovora sa backend-a
        } catch (error) {
            return rejectWithValue("Failed to move card");
        }
    }
);


export const addToBoard = createAsyncThunk(
  "cards/addToActiveSprint",
  async ( cardId: number, { rejectWithValue }) => {
      try {
          const updatedCard = await addToActiveSprint(cardId);
          return Array.isArray(updatedCard) ? updatedCard : [];      } catch (error) {
          return rejectWithValue("Failed to add card to active spritn");
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
    },
    resetCards: (state, action: PayloadAction<Card[]>) => {
      state.cards = [];
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
   
      .addCase(moveCardToNewColumn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(moveCardToNewColumn.fulfilled, (state, action) => {
        state.status = "succeeded";
      
        const { cardId, newStatus } = action.meta.arg;
      
        const cardIndex = state.cards.findIndex(card => card.id === cardId);
        if (cardIndex !== -1) {
          state.cards[cardIndex] = {
            ...state.cards[cardIndex],
            status: newStatus as Status 
          };
        }
      })

      .addCase(addToBoard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(addToBoard.pending, (state) => {
        state.status = "loading";
      })
   
      .addCase(addToBoard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cards = action.payload;
      })
      
  },
});

export const { setCards, resetCards } = cardSlice.actions;

export default cardSlice.reducer;


