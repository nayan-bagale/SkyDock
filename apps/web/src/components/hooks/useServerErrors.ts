import { useEffect, useState } from "react";

const useServerErrors = () => {
  const [serverError, setServerError] = useState<string>("");

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (serverError) {
      timeout = setTimeout(() => {
        setServerError("");
      }, 5000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [serverError]);

  return [serverError, setServerError] as const;
};

export default useServerErrors;
