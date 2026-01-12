import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark" | "system";

interface GlobalState {
  isSidebarCollapsed: boolean;
  theme: ThemeMode;              // user preference   
  resolvedTheme: "light" | "dark"; // actual applied theme
}

/* ---------- helpers ---------- */
const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

/* ---------- initial state ---------- */
const initialState: GlobalState = {
  isSidebarCollapsed: false,
  theme: "system",
  resolvedTheme: getSystemTheme(),
};

/* ---------- slice ---------- */
const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },

    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      state.resolvedTheme =
        action.payload === "system"
          ? getSystemTheme()
          : action.payload;
    },

    syncSystemTheme: (state) => {
      if (state.theme === "system") {
        state.resolvedTheme = getSystemTheme();
      }
    },
  },
});

export const {
  setIsSidebarCollapsed,
  setTheme,
  syncSystemTheme,
} = globalSlice.actions;

export default globalSlice.reducer;
