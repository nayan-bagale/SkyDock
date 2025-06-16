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
                // backdropFilter: "blur(12px)",
                transition: { delay: index * 0.03 },
            }}
            exit={{ opacity: 0, y: 10 }}
            whileTap={{ scale: 0.9 }}

            className="border border-white/30 bg-white/20 backdrop-blur-md cursor-pointer rounded-3xl outline-sky-40"
        >
            <div
                title={app.name}
                className="px-4  p-1 flex flex-col items-center justify-center"
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
