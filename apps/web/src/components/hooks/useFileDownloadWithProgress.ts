import { useGetFileUrlMutation } from "@/redux/APISlice";
import { FileT } from "@skydock/types";
// import { FileT } from "@/redux/features/explorer/explorerSlice";

const useFileDownloadWithProgress = () => {
  const [getFileUrl] = useGetFileUrlMutation();

  const getDownloadUrl = async (id: string): Promise<string | null> =>
    (await getFileUrl(id).unwrap())?.url || null;

  const downloadFile = async (item: FileT) => {
    const fileDownloadUrl = await getDownloadUrl(
      `${item.id}.${item.name.split(".").pop()}`
    );
    if (!fileDownloadUrl) return;
    try {
      const response = await fetch(fileDownloadUrl);
      if (!response?.body) return;

      const contentLength = response.headers.get("Content-Length");
      const totalLength =
        typeof contentLength === "string" && parseInt(contentLength);

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let receivedLength = 0;
      //   ts-ignore
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("Download complete");
          break;
        }
        if (!value) continue;
        chunks.push(value);

        receivedLength += value?.length;
        if (typeof totalLength === "number") {
          const progress =
            parseFloat((receivedLength / totalLength).toFixed(2)) * 100;
          //TODO: Add a progress bar to show download progress to the user
          //TODO: Add Throttling for the progress bar
          //TODO: Refer https://www.npmjs.com/package/lodash.throttle
          //TODO: Add a toast notification to show download progress to the user
          console.log(`Received ${progress}% of the file`);
        }
      }

      const blob = new Blob(chunks);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = item.name;
      const handleOnDownload = () => {
        setTimeout(() => {
          URL.revokeObjectURL(url);
          a.removeEventListener("click", handleOnDownload, false);
        }, 0);
      };
      a.addEventListener("click", handleOnDownload, false);
      a.click();
    } catch (error) {
      console.error(error);
    }
  };
  return { downloadFile };
};

export default useFileDownloadWithProgress;
