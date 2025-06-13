import { Icons } from "@skydock/ui/icons";
import { motion } from "framer-motion";

interface App {
    id: number;
    name: string;
    Icon: typeof Icons.Folder; // Assuming Icon is a React component
    open: () => void;
}

interface AppCardProps {
    app: App;
    index: number;
}

export const AppCard = ({ app, index }: AppCardProps) => {
    const Icon = app.Icon;
    return (
        <motion.button
            onClick={app.open}
            initial={{ opacity: 0, y: 10 }}
            animate={{
                opacity: 1,
                y: 0,
                transition: { delay: index * 0.03 },
            }}
            exit={{ opacity: 0, y: 10 }}
            whileTap={{ scale: 0.95 }}
            className=" cursor-pointer rounded-2xl outline-sky-40"
        >
            <div
                title={app.name}
                className=" bg-white px-4 hover:border-white rounded-2xl p-1 flex flex-col items-center justify-center"
            >
                <div
                    className={`p-1 rounded-md flex items-center justify-center text-white text-sm `}
                >
                    <Icon className="h-12" />
                </div>
                <p className="text-xs text-gray-900 text-center leading-tight font-medium truncate w-[10ch]">
                    {app.name}
                </p>
            </div>
        </motion.button>
    );
};
