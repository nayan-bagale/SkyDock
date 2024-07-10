import { Icons } from "@repo/ui/icons";
import { FC, useState } from "react";

interface FolderT {
    id: Number;
    isFolder: Boolean;
    name: String;
    items: FolderT[]
}

export const Folders = () => {

    const folder_d: FolderT[] = [
        {
            id: 1,
            isFolder: true,
            name: "Folder 1",
            items: [
                {
                    id: 11,
                    isFolder: true,
                    name: "Folder 11",
                    items: [{
                        id: 111,
                        isFolder: true,
                        name: "Folder 111",
                        items: []
                    }]
                },
                {
                    id: 12,
                    isFolder: true,
                    name: "Folder 12",
                    items: []
                },
                {
                    id: 13,
                    isFolder: true,
                    name: "Folder 13",
                    items: []
                },
            ]
        },
        {
            id: 2,
            isFolder: true,
            name: "Folder 2",
            items: []
        }
    ]

    const F_recur: FC<{ folder: FolderT }> = ({ folder }) => {
        const [show, setShow] = useState(false);

        return (
            <div key={folder.id.toString()} className=" flex flex-col gap-1 px-6">
                <div key={folder.id.toString()} className=" flex items-center gap-2 px-2 bg-slate-200" onClick={() => setShow(p => !p)}>
                    <Icons.Folder className="h-4 w-4" /> {folder.name}
                </div>
                <div>
                    {show && (folder.items.map((f) => (<F_recur folder={f} />)))}
                </div>
            </div>


        )
    }

    return folder_d.map((folder) => (<F_recur folder={folder} />));


}