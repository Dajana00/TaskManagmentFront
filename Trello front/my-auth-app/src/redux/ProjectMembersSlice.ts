import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../redux/User";
import { addOnProject, getProjectMembers, getProjectNonMembers } from "../services/UserService";
import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils";
import { getByProjectId } from "../services/SprintService";

export const fetchProjectMembers = createAsyncThunk(
  "projectMembers/fetchMembers",
  async (projectId: number, { rejectWithValue }) => {
    try {
      const response = await getProjectMembers(projectId);
      console.log("Slice: ", response);
      return response;
    } catch (error) {
      return rejectWithValue("Failed to fetch ==-members: " + error);
    }
  }
);

export const addNewMember = createAsyncThunk(
  "projectMembers/addNewMember",
  async ({projectId,userId}:{userId:number, projectId:number}, { rejectWithValue }) => {
    try {
      const response = await addOnProject(projectId,userId);
      return response;
    } catch (error) {
      return rejectWithValue("failed"+error);
    }
  }
);

interface ProjectMembersState {
  members: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProjectMembersState = {
  members: [],
  status: "idle",
  error: null,
};

const projectMembersSlice = createSlice({
  name: "projectMembers",
  initialState,
  reducers: {
    setMembers: (state, action: PayloadAction<User[]>) => {
            state.members = action.payload;
        },
    clearMembers: (state) => {
      state.members = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectMembers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProjectMembers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = "succeeded";
        state.members = action.payload;
      })
      .addCase(fetchProjectMembers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(addNewMember.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addNewMember.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.members.push(action.payload); 
      })
      .addCase(addNewMember.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearMembers, setMembers } = projectMembersSlice.actions;

export default projectMembersSlice.reducer;
