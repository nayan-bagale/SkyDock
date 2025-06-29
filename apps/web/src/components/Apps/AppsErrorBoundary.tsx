import { showToast } from "@skydock/ui/toast";
import { ErrorInfo, FC, ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface AppOptions {
    open: () => void;
    close: () => void;
    isProcessOn: boolean;
    isLoading: boolean;
    setLoadingTrue: () => void;
    setLoadingFalse: () => void;
}

const AppsErrorBoundary: FC<{ children: ReactNode, app: AppOptions }> = ({ children, app, }) => {
    const onError = (error: Error, info: ErrorInfo) => {
        app.close();
        console.error("ErrorBoundary caught an error:", error, info);
        // You can also log the error to an error reporting service here
        // e.g., Sentry, LogRocket, etc.
        showToast("An error occurred in the app.", "error");
    }
    return (
        <ErrorBoundary onError={onError} fallback={<> </>}>
            {children}
        </ErrorBoundary>
    )
}

export default AppsErrorBoundary