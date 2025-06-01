import { BackgroundT, ThemeT } from "@skydock/types";

export const theme = [
  { id: "color-1", color: "bg-gradient-to-r from-rose-100 to-teal-100" },
  { id: "color-2", color: "bg-gradient-to-r from-violet-200 to-pink-200" },
  { id: "color-3", color: "bg-gradient-to-r from-blue-200 to-cyan-200" },
  { id: "color-4", color: "bg-gradient-to-r from-emerald-200 to-lime-200" },
  { id: "color-5", color: "bg-gradient-to-r from-amber-100 to-orange-200" },
  { id: "color-6", color: "bg-gradient-to-r from-indigo-200 to-purple-200" },
  { id: "color-7", color: "bg-gradient-to-r from-sky-100 to-blue-200" },
  { id: "color-8", color: "bg-gradient-to-r from-red-100 to-pink-200" },
] as ThemeT[];

export const background = [
  { id: "bg1", src: "background-1.jpg" },
  { id: "bg2", src: "background-2.jpg" },
  { id: "bg3", src: "background-3.jpg" },
  // { id: "bg4", src: "background-4.jpg" },
] as BackgroundT[];
