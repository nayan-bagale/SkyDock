export enum AppsT {
  AppsMenu = "AppsMenu",
  Terminal = "Terminal",
  Explorer = "Explorer",
  Settings = "Settings",
  ImageViewer = "ImageViewer",
  MusicPlayer = "MusicPlayer",
  VideoPlayer = "VideoPlayer",
  PdfReader = "PdfReader",
  Trash = "Trash",
  NotePad = "NotePad",
  Camera = "Camera",
}

export const APPS_TEXT: Record<AppsT, string> = {
  [AppsT.AppsMenu]: "Apps Menu",
  [AppsT.Terminal]: "Terminal",
  [AppsT.Explorer]: "Explorer",
  [AppsT.Settings]: "Settings",
  [AppsT.ImageViewer]: "Image Viewer",
  [AppsT.MusicPlayer]: "Music Player",
  [AppsT.VideoPlayer]: "Video Player",
  [AppsT.PdfReader]: "PDF Reader",
  [AppsT.Trash]: "Trash",
  [AppsT.NotePad]: "NotePad",
  [AppsT.Camera]: "Camera",
} as const;
