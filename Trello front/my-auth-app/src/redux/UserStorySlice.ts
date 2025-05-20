import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserStory } from "../types/UserStory";
import { createUserStory, getById } from "../services/UserStoryService";
import { getByBacklogId} from "../services/UserStoryService"
import { RootState } from "./store";
import axiosInstance from "../utils/AxiosIntance";
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
export const fetchUserStoriesById = createAsyncThunk(
    "userStories/fetchById",
    async (id: number) => {
        return await getById(id);
    }
);
export const updateUserStory = createAsyncThunk(
    "userStories/updateUserStory",
    async ({ id, updatedStory }: { id: number; updatedStory: Partial<UserStory> }) => {
        const response = await axiosInstance.put(`userStory/update/${id}`, updatedStory);
        return response.data;
    }
);


export const deleteUserStory = createAsyncThunk(
    "userStories/deleteUserStory",
    async (id: number) => {
        await axiosInstance.delete(`userStory/delete/${id}`);
        return id;
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
            })
            .addCase(fetchUserStoriesById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserStoriesById.fulfilled, (state, action: PayloadAction<UserStory>) => {
                state.loading = false;
                const exists = state.userStories.find(us => us.id === action.payload.id);
                if (!exists) {
                    state.userStories.push(action.payload);
                }
            })
            
            .addCase(fetchUserStoriesById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch User Stories";
            })
            .addCase(updateUserStory.fulfilled, (state, action: PayloadAction<UserStory>) => {
                const index = state.userStories.findIndex(us => us.id === action.payload.id);
                if (index !== -1) {
                    state.userStories[index] = action.payload;
                        }
        })
        .addCase(updateUserStory.rejected, (state, action) => {
            state.error = action.error.message || "Failed to update User Story";
        })

        .addCase(deleteUserStory.fulfilled, (state, action: PayloadAction<number>) => {
            state.userStories = state.userStories.filter(us => us.id !== action.payload);
        })
        .addCase(deleteUserStory.rejected, (state, action) => {
            state.error = action.error.message || "Failed to delete User Story";
        });

    },
});

export const { setUserStories , resetUserStories} = userStorySlice.actions;


export default userStorySlice.reducer;
