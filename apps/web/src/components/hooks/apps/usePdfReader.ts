import { showToast } from "@skydock/ui/toast";
import { useCallback, useState } from "react";

const usePdfReader = () => {
  const [numPages, setNumPages] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }): void => {
      setNumPages(numPages);
      setIsLoading(false);
    },
    []
  );

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error("Error loading PDF:", error);
    setIsLoading(false);
    showToast("Error loading PDF document", "error");
  }, []);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3.0));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1.0);
  };

  return {
    numPages,
    onDocumentLoadSuccess,
    onDocumentLoadError,
    scale,
    isLoading,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
  };
};

export default usePdfReader;
