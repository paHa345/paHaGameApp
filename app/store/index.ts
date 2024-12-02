import { configureStore } from "@reduxjs/toolkit";

import { crosswordSlice } from "./crosswordSlice";
import { authSlice } from "./authSlice";
import { appStateSlice } from "./appStateSlice";
import { crosswordGameSlice } from "./crosswordGameSlice";
import { attemptsSlice } from "./attemptsSlice";

const store = configureStore({
  reducer: {
    crosswordState: crosswordSlice.reducer,
    crosswordGameState: crosswordGameSlice.reducer,
    authState: authSlice.reducer,
    appState: appStateSlice.reducer,
    attemptsState: attemptsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

export type AppDispatch = typeof store.dispatch;
