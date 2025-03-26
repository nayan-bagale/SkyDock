import { Button } from "@/ui/button";
import { useEffect, useState } from "react";

interface RenameInputBoxProps {
    setIsRenaming: (value: React.SetStateAction<boolean>) => void;
    handleRename: (newName: string) => void;
    currentName: string;
}

const RenameInputBox = ({ setIsRenaming, handleRename, currentName }: RenameInputBoxProps) => {
    const [newName, setNewName] = useState('');

    useEffect(() => {
        setNewName(currentName);
    }, [currentName]);

    const handleRenameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;
        handleRename(newName);
        setIsRenaming(false);
    }

    return (
        <form onSubmit={handleRenameSubmit} className="p-1">
            <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
                className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
                onBlur={() => setIsRenaming(false)}
            />
            <div className="flex justify-end mt-2">
                <Button
                    type="button"
                    onClick={() => setIsRenaming(false)}
                    className="mr-2"
                >
                    Cancel
                </Button>
                <Button type="submit">Rename</Button>
            </div>
        </form>
    )
}

export default RenameInputBox