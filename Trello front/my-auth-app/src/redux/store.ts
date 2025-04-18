import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./User.slice";
import boardReducer from "./BoardSlice"
import cardReducer from"./CardSlice";
import userStoryReducer from "./UserStorySlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    board: boardReducer,
    card: cardReducer,
    userStory: userStoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
