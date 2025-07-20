export function getSupportedMediaRecorderMimeType(): string {
  const possibleTypes = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
    "video/mp4", // Some Chromium browsers might support this
  ];

  for (const type of possibleTypes) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }

  throw new Error(
    "No supported MediaRecorder MIME type found in this browser."
  );
}
