import { SupportedMimeTypes } from "@skydock/types/enums";

function SupportedMimeTypeCheck(mimeType: string): boolean {
  const supportedMimeTypes = Object.values(SupportedMimeTypes);

  for (const type of supportedMimeTypes) {
    if (mimeType.startsWith(type)) {
      return true;
    }
  }

  return false;
}

export default SupportedMimeTypeCheck;
