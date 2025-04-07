import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getBoardById } from "../services/BoardService";
import { Board } from "../types/Board";

interface BoardState {
  board: Board | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: BoardState = {
  board: null,
  status: "idle",
  error: null,
};

export const fetchBoardById = createAsyncThunk("board/fetchBoard", async (boardId: number) => {
  const board = await getBoardById(boardId);
  return board;
});

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoardById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBoardById.fulfilled, (state, action: PayloadAction<Board>) => {
        state.status = "idle";
        state.board = action.payload;
      })
      .addCase(fetchBoardById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error fetching board";
      });
  },
});

export default boardSlice.reducer;
