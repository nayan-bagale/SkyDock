import { Button } from "@/ui/button";
import { nanoid } from "@reduxjs/toolkit";
import { Icons } from "@skydock/ui/icons";
import React, { useRef } from "react";
import useFileUploadsAndUpdateState from "../hooks/useFileUploadsAndUpdateState";

const FileUploadButton = ({ onClick, parent }: { onClick: () => void; parent: string }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [getUploadUrls] = useFileUploadsAndUpdateState();

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleExternalfiles = async (files: Pick<React.ChangeEvent<HTMLInputElement>, 'target'>['target']['files']) => {
        if (!files || !parent) return;

        const Arrayfiles = Array.from(files);
        const filesObj = Arrayfiles.filter((file) => file.type !== "").map(
            (file) => ({
                id: nanoid(),
                isFolder: false as const,
                name: file.name,
                parent,
                details: {
                    name: file.name,
                    size: file.size.toString(),
                    // size_display: changeBytes(file.size),
                    type: file.type,
                    lastModified: file.lastModified.toString(),
                    File: file,
                },
            })
        );

        await getUploadUrls(filesObj);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleExternalfiles(event.target.files);
        onClick && onClick();
    };

    return (
        <div>
            <Button size={'menu'} onClick={handleButtonClick}>
                <div>Upload File</div>
                <Icons.Upload1 className="h-4" />
            </Button>
            <input
                type="file"
                style={{ display: 'none' }}
                // style={{ opacity: "0" }}
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
            />
        </div>
    );
};

export default FileUploadButton;