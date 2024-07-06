import { createSlice } from "@reduxjs/toolkit";

export interface FileT {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModifiedDate: string;
  File: File;
}

const initalState = {
  files: [
    // {
    //   id: nanoid(),
    //   name: "",
    //   size: 0,
    //   type: "",
    //   lastModifiedDate: "",
    //   File: null,
    // },
  ],
} as { files: FileT[] };

export const filesSlice = createSlice({
  name: "files",
  initialState: initalState,
  reducers: {
    addFiles: (state, action) => {
      state.files.push(action.payload);
    },
    removeFiles: (state, action) => {
      state.files = state.files.filter((file) => file.id !== action.payload);
    },
  },
});

export const { addFiles, removeFiles } = filesSlice.actions;

export default filesSlice.reducer;
