import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./User.slice";
import boardReducer from "./BoardSlice"
import cardReducer from"./CardSlice";
import userStoryReducer from "./UserStorySlice"
import sprintReducer from "./SprintSlice";
import projectReducer from "./ProjectSlice"
import projectMembersReducer from "./ProjectMembersSlice"
import projectNonMembersReducer from "./ProjectNonMembersSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    board: boardReducer,
    card: cardReducer,
    userStory: userStoryReducer,
    sprint: sprintReducer,
    project: projectReducer,
    projectMembers: projectMembersReducer,
    projectNonMembers: projectNonMembersReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


