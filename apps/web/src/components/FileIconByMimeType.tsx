import { Icons } from "@skydock/ui/icons";

const IconByMimeType = (mimeType: string | null) => {
    if (!mimeType) {
        return Icons.Folder
    }

    const imageTypes = ['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/x-jps', 'image/png', 'image/gif', 'image/webp'];

    if (imageTypes.includes(mimeType)) {
        return Icons.Image
    }

    switch (mimeType) {
        case 'application/pdf':
            return Icons.PDF
        default:
            return Icons.File
    }

}

export default IconByMimeType;