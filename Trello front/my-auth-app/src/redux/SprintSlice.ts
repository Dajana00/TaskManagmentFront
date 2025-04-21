import { createSlice, createAsyncThunk, PayloadAction, AsyncThunkAction, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Sprint, SprintStatus } from "../types/Sprint";
import {activateSprint, createSprint, getByProjectId } from "../services/SprintService";

export const addNewSprint = createAsyncThunk(
  "sprint/addNewSprint",
  async (sprint: Omit<Sprint, "id">, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await createSprint(sprint);
      return response;
    } catch (error) {
      return rejectWithValue("Failed to create card");
    }
  }
);
export const fetchByProjectId = createAsyncThunk(
  "sprints/fetchByProjectId",
  async (projectId: number, { rejectWithValue }) => {
    try {
      const response = await getByProjectId(projectId);
      console.log("Spritovi projekta: ", response);
      return response; 

    } catch (error) {
      return rejectWithValue("Failed to fetch sprints");
    }
  }
);

export const activateSprintById = createAsyncThunk(
  "sprints/activate",
  async (sprintId: number, { rejectWithValue }) => {
    try {
      console.log("Slice za akticaciju: ", sprintId)
      const response = await activateSprint(sprintId);
      return response; 

    } catch (error) {
      return rejectWithValue("Failed to activate sprint");
    }
  }
);
const sprintSlice = createSlice({
  name: "sprints",
  initialState: {
    sprints: [] as Sprint[],
    status: "idle",
    error: null as string | null,
  },
  reducers: {
    setSprints: (state, action: PayloadAction<Sprint[]>) => {
        state.sprints = action.payload;
    },
    resetSprints: (state) => {
        state.sprints = [];
        state.status = "idle";
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addNewSprint.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addNewSprint.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sprints.push(action.payload);
      })
      .addCase(addNewSprint.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
      
      
  },
});

export const { setSprints, resetSprints} = sprintSlice.actions;

export default sprintSlice.reducer;


