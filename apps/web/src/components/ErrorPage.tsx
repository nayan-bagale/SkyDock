import { Button } from "@/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { FallbackProps } from "react-error-boundary";


const ErrorPage = ({ error, resetErrorBoundary }: FallbackProps) => {
    const handleGoHome = () => {


        window.location.href = "/";

    };

    const handleRetry = () => {
        if (resetErrorBoundary) {
            resetErrorBoundary();
        } else {
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen backdrop-blur-xl bg-black/20 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                {/* Error Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                            <AlertTriangle className="w-12 h-12 text-red-500" />
                        </div>
                        <div className="absolute inset-0 w-24 h-24 bg-red-200 rounded-full animate-ping opacity-20"></div>
                    </div>
                </div>

                {/* Error Message */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-3">
                        Oops! Something went wrong
                    </h1>
                    <p className="text-gray-200 mb-4">
                        We encountered an unexpected error. Don't worry, it's not your fault!
                    </p>

                    {error && (
                        <div className="bg-red-50/50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-red-700 font-medium mb-2">Error Details:</p>
                            <p className="text-xs text-red-600 font-mono bg-red-100 p-2 rounded">
                                {error.message}
                            </p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className=" space-x-3 flex">
                    <Button
                        onClick={handleRetry}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </Button>

                    <Button
                        onClick={handleGoHome}
                        className="w-full border-gray-300 text-white hover:text-gray-700 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg transition-all duration-200"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Go to Home
                    </Button>
                </div>

                {/* Additional Help */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-200">
                        If this problem persists, please{" "}
                        <a
                            href="mailto:skydockos@gmail.com"
                            className="text-blue-600 hover:text-blue-700 underline"
                        >
                            contact support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;