import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserStory } from "../types/UserStory";
import { createUserStory } from "../services/UserStoryService";

// Definišemo tip za stanje
interface UserStoryState {
    userStories: UserStory[];
    loading: boolean;
    error: string | null;
}

const initialState: UserStoryState = {
    userStories: [],
    loading: false,
    error: null,
};

// Async thunk za dodavanje nove User Story stavke
export const addUserStory = createAsyncThunk(
    "userStories/addUserStory",
    async (newStory: Omit<UserStory, "id">) => {
        return await createUserStory(newStory);
    }
);

const userStorySlice = createSlice({
    name: "userStories",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addUserStory.pending, (state) => {
                state.loading = true;
            })
            .addCase(addUserStory.fulfilled, (state, action: PayloadAction<UserStory>) => {
                state.loading = false;
                state.userStories.push(action.payload);
            })
            .addCase(addUserStory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to create User Story";
            });
    },
});

export default userStorySlice.reducer;
