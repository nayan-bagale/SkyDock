import { nanoid } from "@reduxjs/toolkit";

export const fileArrayGenerator = (files: File[], parentId: string) => {
  if (!files || files.length === 0) return [];
  const Arrayfiles = Array.from(files);
  console.log(files);
  return Arrayfiles.map((file) => ({
    id: nanoid(),
    isFolder: false as const,
    name: file.name,
    parent: parentId,
    details: {
      name: file.name,
      size: file.size.toString(),
      type: file.type,
      lastModified: file.lastModified.toString(),
      File: file,
    },
  }));
};
