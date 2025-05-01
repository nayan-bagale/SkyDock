import { Icons } from "@skydock/ui/icons";

const IconByMimeType = (mimeType: string | null) => {
    if (!mimeType) {
        return Icons.Folder
    }

    const imageTypes = ['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/x-jps', 'image/png', 'image/gif', 'image/webp'];

    if (imageTypes.includes(mimeType)) {
        return Icons.Image
    } else if (mimeType.startsWith('audio/')) {
        return Icons.Music
    } else if (mimeType === 'application/pdf') {
        return Icons.PDF
    } else if (mimeType.startsWith('video/')) {
        return Icons.Video
    }


    return Icons.File


}

export default IconByMimeType;