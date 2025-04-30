import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserStory } from "../types/UserStory";
import { createUserStory } from "../services/UserStoryService";
import { getByBacklogId} from "../services/UserStoryService"
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

export const fetchUserStoriesByBacklogId = createAsyncThunk(
    "userStories/fetchByBacklogId",
    async (backlogId: number) => {
        return await getByBacklogId(backlogId);
    }
);


const userStorySlice = createSlice({
    name: "userStories",
    initialState,
    reducers: {
        setUserStories: (state, action: PayloadAction<UserStory[]>) => {
            state.userStories = action.payload;
        },
        resetUserStories: (state) => {
            state.userStories = []; 
        },
    },
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
            })
            .addCase(fetchUserStoriesByBacklogId.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserStoriesByBacklogId.fulfilled, (state, action: PayloadAction<UserStory[]>) => {
                state.loading = false;
                state.userStories = action.payload;
            })
            .addCase(fetchUserStoriesByBacklogId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch User Stories";
            });
    },
});

export const { setUserStories , resetUserStories} = userStorySlice.actions;


export default userStorySlice.reducer;
