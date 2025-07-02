import { useGetFileUrlMutation } from "@/redux/apis/filesAndFolderApi";
import { FileT } from "@skydock/types";
import { showProgressToast } from "@skydock/ui/toast";
import { toast } from "sonner";

const useFileDownloadWithProgress = () => {
  const [getFileUrl] = useGetFileUrlMutation();

  const getDownloadUrl = async (id: string): Promise<string | null> =>
    (await getFileUrl(id).unwrap())?.url || null;

  const downloadFile = async (item: FileT) => {
    let toastId: string | number | undefined;

    try {
      const fileDownloadUrl = await getDownloadUrl(
        `${item.id}.${item.name.split(".").pop()}`
      );
      if (!fileDownloadUrl) return;
      const controller = new AbortController();
      const response = await fetch(fileDownloadUrl, {
        signal: controller.signal,
      });

      toastId = showProgressToast({
        status: "loading",
        fileName: item.name,
        progress: 0,
      });

      if (!response?.body) return;

      const contentLength = response.headers.get("Content-Length");
      const totalLength =
        typeof contentLength === "string" && parseInt(contentLength);

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let receivedLength = 0;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        if (!value) continue;
        chunks.push(value);

        receivedLength += value?.length;
        if (typeof totalLength === "number") {
          const progress =
            parseFloat((receivedLength / totalLength).toFixed(2)) * 100;
          showProgressToast(
            {
              status: "loading",
              fileName: item.name,
              progress: progress,
              abort: () => controller.abort(),
            },
            {
              id: toastId,
            }
          );
          //TODO: Add Throttling for the progress bar
          //TODO: Refer https://www.npmjs.com/package/lodash.throttle
          // console.log(`Received ${progress}% of the file`);
        }
      }

      const blob = new Blob(chunks as BlobPart[]);
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
      showProgressToast(
        {
          status: "success",
          progress: 100,
          fileName: item.name,
        },
        {
          id: toastId,
        }
      );
    } catch (error) {
      console.error(error);

      showProgressToast(
        {
          status: "error",
          progress: 0,
          fileName: item.name,
        },
        {
          id: toastId || undefined,
        }
      );
    } finally {
      if (toastId) {
        setTimeout(() => {
          toast.dismiss(toastId);
        }, 2000);
      }
    }
  };
  return { downloadFile };
};

export default useFileDownloadWithProgress;
