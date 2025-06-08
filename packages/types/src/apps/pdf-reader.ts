import { ActionsT } from "../common";
import { FileT } from "../explorer-items";

export interface PdfReaderStateT {
  actions: ActionsT;
  pdfInfo: FileT | null;
  state: {
    isLoading: boolean;
  };
}
