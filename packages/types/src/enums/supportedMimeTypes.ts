// INFO: This for supported mime types if want to add new file support kindly add it here
export enum SupportedMimeTypes {
  Image = "image/",
  ImageJpeg = "image/jpeg",
  ImageJpg = "image/jpg",
  ImagePng = "image/png",
  Audio = "audio/",
  Video = "video/",
  VideoWebm = "video/webm",
  PDF = "application/pdf",
  Text = "text/plain",
  JSON = "application/json",
  CSV = "text/csv",
  Markdown = "text/markdown",
  HTML = "text/html",
}

export enum FileExtensions {
  txt = "txt",
  json = "json",
  csv = "csv",
  md = "md",
  jpg = "jpg",
  jpeg = "jpeg",
  png = "png",
  webm = "webm",
}

export const FILE_EXTENSIONS_TO_MIME_TYPES: Record<
  FileExtensions,
  SupportedMimeTypes
> = {
  [FileExtensions.txt]: SupportedMimeTypes.Text,
  [FileExtensions.json]: SupportedMimeTypes.JSON,
  [FileExtensions.csv]: SupportedMimeTypes.CSV,
  [FileExtensions.jpg]: SupportedMimeTypes.ImageJpg,
  [FileExtensions.jpeg]: SupportedMimeTypes.ImageJpeg,
  [FileExtensions.png]: SupportedMimeTypes.ImagePng,
  [FileExtensions.md]: SupportedMimeTypes.Markdown,
  [FileExtensions.webm]: SupportedMimeTypes.VideoWebm,
};
