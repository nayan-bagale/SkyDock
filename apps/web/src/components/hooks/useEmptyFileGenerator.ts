import { addItemToFolder } from "@/redux/features/explorer/explorerSlice";
import { fileArrayGenerator } from "@/utils/file-array-generator";
import { FileExtensions } from "@skydock/types/enums";
import { useCallback } from "react";
import { useBlobFileGenerator } from "./useBlobFileGenerator";
import useFileUploadsAndUpdateState from "./useFileUploadsAndUpdateState";

const useEmptyFileGenerator = () => {
  const { generateFile } = useBlobFileGenerator();
  const [uploadFileAndUpdateState] =
    useFileUploadsAndUpdateState(addItemToFolder);

  const generateEmptyFile = useCallback(
    async ({
      mimeType,
      fileName,
      folderId,
    }: {
      mimeType: keyof typeof FileExtensions;
      fileName: string;
      folderId: string;
    }) => {
      const buffer_file = generateFile({
        content: "",
        name: fileName,
        type: mimeType,
      });
      if (!buffer_file) return;
      const structuredFile = fileArrayGenerator([buffer_file], folderId);
      uploadFileAndUpdateState(structuredFile);
    },
    []
  );

  return { generateEmptyFile };
};

export default useEmptyFileGenerator;
