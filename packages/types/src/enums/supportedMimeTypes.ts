// INFO: This for supported mime types if want to add new file support kindly add it here
export enum SupportedMimeTypes {
  Image = "image/",
  Audio = "audio/",
  Video = "video/",
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
}

export const FILE_EXTENSIONS_TO_MIME_TYPES: Record<
  FileExtensions,
  SupportedMimeTypes
> = {
  [FileExtensions.txt]: SupportedMimeTypes.Text,
  [FileExtensions.json]: SupportedMimeTypes.JSON,
  [FileExtensions.csv]: SupportedMimeTypes.CSV,
  [FileExtensions.md]: SupportedMimeTypes.Markdown,
};
