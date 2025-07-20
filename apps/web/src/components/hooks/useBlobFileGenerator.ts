import { FileExtensions, SupportedMimeTypes } from "@skydock/types/enums";
import { showToast } from "@skydock/ui/toast";
import { useState } from "react";

type SupportedFileType = keyof typeof FileExtensions;

interface FileInput {
  name: string; // without extension
  content: any; // raw content
  type: SupportedFileType;
}

interface FileGenerationResult {
  file: File | null;
  error: string | null;
  generateFile: (input: FileInput) => File | null;
}

export function useBlobFileGenerator(): FileGenerationResult {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateFile = ({ name, content, type }: FileInput) => {
    try {
      let blob: Blob | undefined;
      let mimeType = SupportedMimeTypes.Text;

      switch (type) {
        case "txt":
        case "md":
          blob = new Blob([String(content)], { type: SupportedMimeTypes.Text });
          break;

        case "json":
          blob = new Blob([JSON.stringify(content, null, 2)], {
            type: SupportedMimeTypes.JSON,
          });
          mimeType = SupportedMimeTypes.JSON;
          break;

        case "csv": {
          if (!Array.isArray(content)) {
            throw new Error("CSV content should be an array of objects");
          }
          const csvHeaders = Object.keys(content[0]).join(",");
          const csvRows = content.map((row: Record<string, unknown>) =>
            Object.values(row).join(",")
          );
          const csvString = [csvHeaders, ...csvRows].join("\n");
          blob = new Blob([csvString], { type: SupportedMimeTypes.CSV });
          mimeType = SupportedMimeTypes.CSV;
          break;
        }
        case "jpg":
        case "jpeg":
        case "png": {
          switch (type) {
            case "jpg":
              mimeType = SupportedMimeTypes.ImageJpg;
              break;
            case "jpeg":
              mimeType = SupportedMimeTypes.ImageJpeg;
              break;
            case "png":
              mimeType = SupportedMimeTypes.ImagePng;
              break;
          }

          // Support both Blob and base64 (data URL)
          if (typeof content === "string" && content.startsWith("data:")) {
            // Convert base64 to Blob
            const byteString = atob(content.split(",")[1]);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            blob = new Blob([ab], { type: mimeType });
          } else if (content instanceof Blob) {
            blob = content;
          } else {
            throw new Error(
              "Invalid content format for image. Must be base64 or Blob."
            );
          }
          break;
        }

        case "webm": {
          mimeType = SupportedMimeTypes.VideoWebm;
          if (typeof content === "object") {
            blob = new Blob(content, { type: mimeType });
          }
          break;
        }
        case "mp4": {
          mimeType = SupportedMimeTypes.VideoMp4;
          if (typeof content === "object") {
            blob = new Blob(content, { type: mimeType });
          }
          break;
        }

        default:
          throw new Error(`Unsupported file type: ${type}`);
      }

      const fileName = name.endsWith(`.${type}`) ? name : `${name}.${type}`;

      if (!blob) {
        throw new Error("Failed to generate file blob.");
      }

      const fileWithMeta = new File([blob], fileName, {
        type: mimeType,
      });
      setFile(fileWithMeta);
      setError(null);
      return fileWithMeta;
    } catch (err: any) {
      console.error("Error generating file:", err);
      showToast("Error generating file", "error");
      setFile(null);
      setError(err?.message ?? "Unknown error");
      return null;
    }
  };

  return { file, error, generateFile };
}
