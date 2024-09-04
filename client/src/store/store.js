import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";

class StateLoader {
    loadState() {
        try {
            const savedState = localStorage.getItem("Nexus_Point");
            if (savedState === null) return this.initState();

            return JSON.parse(savedState);
        } catch (e) {
            console.error("Failed to load state:", e);
            return this.initState();
        }
    }

    saveState(localState) {
        try {
            localStorage.setItem("Nexus_Point", JSON.stringify(localState));
        } catch (e) {
            console.error("Failed to save state:", e);
        }
    }

    initState() {
        return {
            user: {
                loggedIn: false,
                accessToken: "",
                userData: {},
            },
        };
    }
}

const stateLoader = new StateLoader();

// load the initial state
const persistedState = stateLoader.loadState();

const store = configureStore({
    reducer: {
        user: userSlice,
    },
    preloadedState: persistedState,
});

// persist the state to local storage whenever it changes
store.subscribe(() => {
    stateLoader.saveState(store.getState());
});

export default store;
