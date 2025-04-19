import { AllFilesResponse } from '@skydock/types';
import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes));

export default cn;

export const initialFilesAndFoldersModifer = (
    items: AllFilesResponse[],
    callback: (item: AllFilesResponse) => void,
) => {
    const itemsObj = items.map((item) => {
        if (item.is_folder) {
            return {
                id: item.id,
                isFolder: item.is_folder,
                name: item.name,
                parent: item.parent_id,
                details: {
                    size: item.size,
                    lastModified: item.last_modified,
                },
                children:
                    items
                        .filter((child) => child.parent_id === item.id)
                        .map((child) => child.id) ?? [],
            };
        } else {
            return {
                id: item.id,
                isFolder: item.is_folder,
                name: item.name,
                parent: item.parent_id,
                details: {
                    name: item.name,
                    size: item.size,
                    type: item.mime_type,
                    lastModified: item.last_modified,
                },
            };
        }
    });

    itemsObj.forEach((item) => callback(item));
};