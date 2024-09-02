import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loggedIn: false,
    accessToken: "",
    userData: {},
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        startSession: (state, action) => {
            state.loggedIn = true;
            state.accessToken = action.payload.accessToken;
            state.userData = action.payload.userData;
        },
        endSession: (state) => {
            state.loggedIn = false;
            state.accessToken = null;
            state.userData = null;
        },
        updateSession: (state, action) => {
            // todo: accessToken updated after updating user data?
            // state.accessToken = action.payload.accessToken;
            state.userData = action.payload.userData;
        },
    },
});

export const { startSession, endSession, updateSession } = userSlice.actions;

export default userSlice.reducer;
