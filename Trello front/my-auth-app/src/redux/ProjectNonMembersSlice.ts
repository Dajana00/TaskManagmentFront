import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../redux/User";
import {  getProjectNonMembers } from "../services/UserService";

export const fetchProjectNonMembers = createAsyncThunk(
  "projectNonMembers/fetchNonMembers",
  async (projectId: number, { rejectWithValue }) => {
    try {
      const response = await getProjectNonMembers(projectId);
      console.log("Slice: ", response);
      return response;
    } catch (error) {
      return rejectWithValue("Failed to fetch non-members: " + error);
    }
  }
);

interface ProjectNonMembersState {
  nonMembers: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProjectNonMembersState = {
    nonMembers: [],
  status: "idle",
  error: null,
};

const projectNonMembersSlice = createSlice({
  name: "projectNonMembers",
  initialState,
  reducers: {
    setNonMembers: (state, action: PayloadAction<User[]>) => {
            state.nonMembers = action.payload;
        },
 
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectNonMembers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProjectNonMembers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = "succeeded";
        state.nonMembers = action.payload;
      })
      .addCase(fetchProjectNonMembers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setNonMembers} = projectNonMembersSlice.actions;

export default projectNonMembersSlice.reducer;
