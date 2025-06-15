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
      let blob: Blob;
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

        default:
          throw new Error(`Unsupported file type: ${type}`);
      }

      const fileName = name.endsWith(`.${type}`) ? name : `${name}.${type}`;

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
      return null;
    }
  };

  return { file, error, generateFile };
}
