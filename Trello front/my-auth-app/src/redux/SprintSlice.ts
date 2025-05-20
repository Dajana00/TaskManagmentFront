import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Sprint } from "../types/Sprint";
import {activateSprint, completeSprint, createSprint, getByProjectId } from "../services/SprintService";

export const addNewSprint = createAsyncThunk(
  "sprint/addNewSprint",
  async (sprint: Omit<Sprint, "id">, { rejectWithValue }) => {
    try {
      const response = await createSprint(sprint);
      return response;
    } catch (error) {
      return rejectWithValue("failed"+error);
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
      return rejectWithValue("Failed to fetch sprints"+error);
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
      return rejectWithValue("Failed to activate sprint"+error);
    }
  }
);
export const completeSprintByBoardId = createAsyncThunk(
  "sprints/complete",
  async (
     boardId: number ,
    { rejectWithValue }
  ) => {
    try {
      console.log("Slice za complete sprinta: ", boardId);
      const response = await completeSprint(boardId);
      return response;
    } catch (error) {
      return rejectWithValue("Failed to activate sprint: " + error);
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
      })
      .addCase(fetchByProjectId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchByProjectId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sprints = action.payload;
      })
      .addCase(fetchByProjectId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(activateSprintById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(activateSprintById.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Ažuriraj sprint u listi (npr. da ima isActive true)
        const updated = action.payload;
        const index = state.sprints.findIndex(s => s.id === updated.id);
        if (index !== -1) {
          state.sprints[index] = updated;
        }
      })
      .addCase(activateSprintById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(completeSprintByBoardId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(completeSprintByBoardId.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Ažuriraj sprint u listi (npr. da je završen)
        const updated = action.payload;
        const index = state.sprints.findIndex(s => s.id === updated.id);
        if (index !== -1) {
          state.sprints[index] = updated;
        }
      })
      .addCase(completeSprintByBoardId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

      
      
  },
});

export const { setSprints, resetSprints} = sprintSlice.actions;

export default sprintSlice.reducer;


