import { create } from "zustand";

// Example store for user & printing uploads
const useStore = create((set, get) => ({
  // User state
  user: null, 
  token: null,
  accessToken: null,
  refreshToken: null,

  // Printing state
//   uploads: [],

  // Actions
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
//   logout: () => set({ user: null, accessToken: null, refreshToken: null }),

//   addUpload: (file) => set((state) => ({ uploads: [...state.uploads, file] })),
//   removeUpload: (fileName) => set((state) => ({ uploads: state.uploads.filter(f => f.originalname !== fileName) })),
//   clearUploads: () => set({ uploads: [] }),
}));

export default useStore;
