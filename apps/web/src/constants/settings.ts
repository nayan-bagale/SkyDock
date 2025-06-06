import { BackgroundT, ThemeT } from "@skydock/types";

export const theme = [
  { id: "color-1", color: "bg-gradient-to-r from-rose-100 to-teal-100" },
  { id: "color-2", color: "bg-gradient-to-r from-violet-200 to-pink-200" },
  { id: "color-3", color: "bg-gradient-to-r from-blue-200 to-cyan-200" },
  { id: "color-6", color: "bg-gradient-to-r from-indigo-200 to-purple-200" },
  { id: "color-7", color: "bg-gradient-to-r from-sky-100 to-blue-200" },
  { id: "color-15", color: "bg-gradient-to-r from-blue-100 to-indigo-200" },

  { id: "color-8", color: "bg-gradient-to-r from-red-100 to-pink-200" },
  { id: "color-5", color: "bg-gradient-to-r from-amber-100 to-orange-200" },
  { id: "color-4", color: "bg-gradient-to-r from-emerald-200 to-lime-200" },
  { id: "color-14", color: "bg-gradient-to-r from-orange-200 to-pink-100" },

  // { id: "color-9", color: "bg-gradient-to-r from-gray-100 to-gray-200" },
  // { id: "color-10", color: "bg-gradient-to-r from-yellow-100 to-lime-200" },
  // { id: "color-11", color: "bg-gradient-to-r from-teal-100 to-cyan-200" },
  // { id: "color-12", color: "bg-gradient-to-r from-purple-100 to-violet-200" },
  // { id: "color-13", color: "bg-gradient-to-r from-red-200 to-pink-100" },
] as ThemeT[];

export const background = [
  { id: "bg1", src: "wallpapers/background-1.jpg" },
  { id: "bg2", src: "wallpapers/background-2.jpg" },
  { id: "bg3", src: "wallpapers/background-3.jpg" },
  { id: "bg4", src: "wallpapers/background-4.jpg" },
  { id: "bg5", src: "wallpapers/background-5.jpg" },
  { id: "bg6", src: "wallpapers/background-6.jpg" },
] as BackgroundT[];
