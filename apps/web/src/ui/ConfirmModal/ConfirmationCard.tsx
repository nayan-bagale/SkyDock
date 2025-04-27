import { Button } from '@/ui/button';
import cn from '@/utils';
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import Card from "./ConfirmModal";

interface ConfirmationCardProps {
    title: string;
    message: string;
    theme?: 'info' | 'destructive' | 'primary';
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationCard = ({
    title,
    message,
    theme = 'info',
    onConfirm,
    onCancel,
}: ConfirmationCardProps) => {
    const themeStyles = {
        info: {
            icon: Info,
            containerClass: 'border-gray-200 bg-gray-50',
            buttonClass: 'bg-gray-600 hover:bg-gray-700',
            iconClass: 'text-gray-600',
        },
        destructive: {
            icon: AlertTriangle,
            containerClass: 'border-red-200 bg-red-50',
            buttonClass: 'bg-red-600 hover:bg-red-700',
            iconClass: 'text-red-600',
        },
        primary: {
            icon: CheckCircle,
            containerClass: 'border-purple-200 bg-purple-50',
            buttonClass: 'bg-purple-600 hover:bg-purple-700',
            iconClass: 'text-purple-600',
        },
    };

    const { icon: Icon, containerClass, buttonClass, iconClass } = themeStyles[theme];

    return (
        <Card className={cn(
            "w-full max-w-md mx-auto p-6 rounded-xl shadow-lg border-2",
            containerClass
        )}>
            <div className="flex flex-col items-center space-y-4">
                <Icon className={cn("w-12 h-12", iconClass)} />

                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                <p className="text-center text-gray-600">{message}</p>

                <div className="flex space-x-4 mt-6 w-full">
                    <Button
                        intent={'action'}

                        className="flex-1 bg-transparent text-gray-900 border border-gray-400  py-2"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        className={cn("flex-1 py-2 text-white", buttonClass)}
                        intent={'action'}
                        onClick={onConfirm}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default ConfirmationCard;