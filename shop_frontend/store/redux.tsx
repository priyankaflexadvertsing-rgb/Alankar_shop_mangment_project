import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  Provider,
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";

import globalReducer from "./slice/global";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";

/* ---------- root reducer ---------- */
const rootReducer = combineReducers({
  global: globalReducer,
});

/* ---------- persist config ---------- */
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["global"], // persist global slice
};

/* ---------- persisted reducer ---------- */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/* ---------- store ---------- */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

export const persistor = persistStore(store);

/* ---------- types ---------- */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/* ---------- hooks ---------- */
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> =
  useSelector;

/* ---------- provider ---------- */
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
