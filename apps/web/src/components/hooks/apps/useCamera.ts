import { useCallback, useEffect, useRef, useState } from "react";

const useCamera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const activeStream = useRef<MediaStream | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);

  const start = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setStream(mediaStream);

      activeStream.current = mediaStream;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not access camera");
    }
  }, []);

  const stop = useCallback(() => {
    if (activeStream.current) {
      activeStream.current.getTracks().forEach((track) => {
        console.log("Stopping track:", track);
        track.stop();
      });
      activeStream.current = null;
      console.log("Camera stopped on unmount");
    }
  }, []);

  useEffect(() => {
    return () => {
      if (activeStream.current) {
        activeStream.current.getTracks().forEach((track) => {
          console.log("Stopping track:", track);
          track.stop();
        });
        activeStream.current = null;
        console.log("Camera stopped on unmount");
      }
    };
  }, []);

  return { stream, error, start, stop, streamRef: activeStream };
};

export default useCamera;
