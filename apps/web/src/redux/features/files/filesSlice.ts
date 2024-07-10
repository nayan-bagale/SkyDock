import { createSlice } from "@reduxjs/toolkit";

export interface FileT {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModifiedDate: string;
  File: File;
}

const changeBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

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
      action.payload.size = changeBytes(action.payload.size);
      state.files.push(action.payload);
    },
    removeFile: (state, action) => {
      state.files = state.files.filter((file) => file.id !== action.payload);
    },
  },
});

export const { addFiles, removeFile } = filesSlice.actions;

export default filesSlice.reducer;
