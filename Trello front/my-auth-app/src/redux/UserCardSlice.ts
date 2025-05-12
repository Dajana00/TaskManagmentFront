import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../redux/User";
import { addOnCard, getCardMembers, getCardNonMembers } from "../services/UserCardService";


export const fetchCardNonMembers = createAsyncThunk(
  "cardMembers/fetchNonMembers",
  async ({cardId, projectId}:{cardId:number, projectId:number} ,{ rejectWithValue }) => {
    try {
      const response = await getCardNonMembers(cardId,projectId);
      console.log("Slice: ", response);
      return response;
    } catch (error) {
      return rejectWithValue("Failed to fetch ==-members: " + error);
    }
  }
);

export const addNewCardMember = createAsyncThunk(
  "cardMembers/addNewMember",
  async ({cardId,userId}:{userId:number, cardId:number}, { rejectWithValue }) => {
    try {
      const response = await addOnCard(cardId,userId);
      return response;
    } catch (error) {
      return rejectWithValue("failed"+error);
    }
  }
);

export const fetchCardMembers = createAsyncThunk(
  "cardMembers/fetchMembers",
  async (cardId: number, { rejectWithValue }) => {
    try {
      const response = await getCardMembers(cardId);
      return response;
    } catch (error) {
      return rejectWithValue("Failed to fetch non-members: " + error);
    }
  }
);
interface CardMembersState {
  members: User[];
  nonMembers: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CardMembersState = {
  members: [],
  nonMembers: [],
  status: "idle",
  error: null,
};

const cardMembersSlice = createSlice({
  name: "cardMembers",
  initialState,
  reducers: {
    setMembers: (state, action: PayloadAction<User[]>) => {
            state.members = action.payload;
        },
    setNonMembers: (state, action: PayloadAction<User[]>) => {
            state.nonMembers = action.payload;
        },
    clearMembers: (state) => {
      state.members = [];
      state.status = "idle";
      state.error = null;
    },
     clearNonMembers: (state) => {
      state.nonMembers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCardMembers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCardMembers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = "succeeded";
        state.members = action.payload;
      })
      .addCase(fetchCardMembers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(addNewCardMember.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addNewCardMember.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.members.push(action.payload); 
      })
      .addCase(addNewCardMember.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
       .addCase(fetchCardNonMembers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCardNonMembers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = "succeeded";
        state.nonMembers = action.payload;
      })
      .addCase(fetchCardNonMembers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearMembers, setMembers , setNonMembers, clearNonMembers} = cardMembersSlice.actions;

export default cardMembersSlice.reducer;
