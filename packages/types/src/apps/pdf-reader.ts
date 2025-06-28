import { ActionsT } from "../common";
import { FileT } from "../explorer-items";

export interface PdfReaderStateT {
  actions: ActionsT;
  pdfReaderInfo: {
    pdfFileInfo: FileT | null;
    pdfUrl: string | null;
  };
  state: {
    isLoading: boolean;
  };
}
