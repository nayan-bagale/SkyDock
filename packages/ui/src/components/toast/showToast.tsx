import classNames from "classnames";
import { motion } from "framer-motion";
import { Ban, Check, CloudUpload, Info, X } from "lucide-react";
import type { ExternalToast } from "sonner";
import { toast } from "sonner";
import { Button } from "../button";

type IToast = {
    message: string;
    toastId: string | number;
    onClose: (toastId: string | number) => void;
};

export const SuccessToast = ({ message, onClose, toastId }: IToast) => (
    <button
        className={classNames(
            // "data-testid-toast-success bg-default dark:bg-inverted text-emphasis dark:text-inverted shadow-elevation-low border-subtle mb-2 flex h-auto space-x-2 rounded-lg border px-3 py-2.5 text-sm font-semibold rtl:space-x-reverse md:max-w-sm"
            " mb-2 flex bg-green-700 text-white border-green-600 h-auto space-x-2 border rounded-xl shadow px-3 py-2.5 text-sm font-semibold rtl:space-x-reverse w-[10rem"
        )}
        onClick={() => onClose(toastId)}>
        <span className="mt-0.5">
            <Check className="h-4 w-4" />
        </span>
        <p data-testid="toast-success" className="m-0 w-full text-left">
            {message}
        </p>
        <span className="mt-0.5">
            <X className=" h-4 w-4 hover:cursor-pointer" />
        </span>
    </button>
);

export const ErrorToast = ({ message, onClose, toastId }: IToast) => (
    <button
        className={classNames(
            " mb-2 flex bg-red-600 text-white border-red-400 h-auto space-x-2 border rounded-xl shadow px-3 py-2.5 text-sm font-semibold rtl:space-x-reverse md:max-w-sm"
        )}
        onClick={() => onClose(toastId)}>
        <span className="mt-0.5">
            <Ban className=" h-4 w-4" />
        </span>
        <p data-testid="toast-error" className="m-0 w-full text-left">
            {message}
        </p>
        <span className="mt-0.5">
            <X className=" h-4 w-4 hover:cursor-pointer" />
        </span>
    </button>
);

export const WarningToast = ({ message, onClose, toastId }: IToast) => (
    <button
        className={classNames(
            " mb-2 flex bg-yellow-400 h-auto space-x-2 border rounded-xl shadow px-3 py-2.5 text-sm font-semibold rtl:space-x-reverse md:max-w-sm"
        )}
        onClick={() => onClose(toastId)}>
        <span className="mt-0.5">
            {/* <Info /> */}
            <Info className=" h-4 w-4" />
        </span>
        <p data-testid="toast-warning" className="m-0 w-full text-left">
            {message}
        </p>
        <span className="mt-0.5">
            <X className=" h-4 w-4 hover:cursor-pointer" />
        </span>
    </button>
);

const TOAST_VISIBLE_DURATION = 6000;

type ToastVariants = "success" | "warning" | "error";

export function showToast(
    message: string,
    variant: ToastVariants,
    // Options or duration (duration for backwards compatibility reasons)
    options: number | ExternalToast = TOAST_VISIBLE_DURATION
) {
    const _options: ExternalToast = typeof options === "number" ? { duration: options } : options;
    if (!_options.duration) _options.duration = TOAST_VISIBLE_DURATION;
    if (!_options.position) _options.position = "bottom-right";

    const onClose = (toastId: string | number) => {
        toast.dismiss(toastId);
    };

    const toastElements: { [x in ToastVariants]: (t: number | string) => JSX.Element } = {
        success: (toastId) => <SuccessToast message={message} onClose={onClose} toastId={toastId} />,
        error: (toastId) => <ErrorToast message={message} onClose={onClose} toastId={toastId} />,
        warning: (toastId) => <WarningToast message={message} onClose={onClose} toastId={toastId} />,
    };

    return toast.custom(
        toastElements[variant] ||
        ((toastId) => <SuccessToast message={message} onClose={onClose} toastId={toastId} />),
        _options
    );
}

export function showProgressToast(
    {
        status,
        progress,
        abort,
        fileName,
    }: {
        status: "loading" | "success" | "error";
        progress: number;
        abort?: () => void;
        fileName?: string;
    },
    options: number | ExternalToast = Infinity,
) {
    const _options: ExternalToast = typeof options === "number" ? { duration: options } : options;
    if (!_options.duration) _options.duration = Infinity;
    if (!_options.position) _options.position = "bottom-right";

    const onClose = (toastId: string | number) => {
        toast.dismiss(toastId);
    };


    return toast.custom(
        (toastId) => (
            <PromiseToast
                toastId={toastId}
                fileName={fileName}
                abort={abort}
                status={status}
                progress={progress}
                onClose={onClose}
            />
        )
        ,
        _options,
    )

}

const PromiseToast = ({ fileName, progress, status, abort }: any) => {

    return (
        <button
            className={classNames(
                " mb-2 pb-3 pt-2 relative flex h-auto overflow-hidden transition-all duration-200 space-x-2 border cursor-wait rounded-xl shadow px-3 text-sm font-semibold rtl:space-x-reverse min-w-[20rem] max-w-[20rem]",
                {
                    'bg-white text-gray-800': status === 'loading' || status === 'success',
                    'bg-red-600 text-white border-red-400': status === 'error',
                }
            )}>
            <span className="mt-0.5">
                {status === 'loading' && <CloudUpload className=" h-4 w-4" />}
                {status === 'success' && <Check className=" h-4 w-4" />}
                {status === 'error' && <Ban className=" h-4 w-4" />}
            </span>
            <p title={fileName} data-testid="toast-warning" className="m-0 w-full truncate text-left">
                {fileName}
            </p>
            {status === 'loading' && <Button intent={'primary'} className=" bg-red-500 hover:bg-red-600">
                <X onClick={abort} className=" h-4 w-4 hover:cursor-pointer" />
            </Button>}
            <motion.div
                className=" absolute bg-sky-400 bottom-1 inset-8 transition h-2 w-0 -left-2 rounded"
                animate={{ width: `${progress}%` }}
            >
            </motion.div>
        </button>
    )

}