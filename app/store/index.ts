import { configureStore } from "@reduxjs/toolkit";

import { crosswordSlice } from "./crosswordSlice";
import { authSlice } from "./authSlice";
import { appStateSlice } from "./appStateSlice";

const store = configureStore({
  reducer: {
    crosswordState: crosswordSlice.reducer,
    authState: authSlice.reducer,
    appState: appStateSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

export type AppDispatch = typeof store.dispatch;
