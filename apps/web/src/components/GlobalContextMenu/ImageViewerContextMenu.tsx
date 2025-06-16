import useFileDownloadWithProgress from '@/components/hooks/useFileDownloadWithProgress';
import { closeContextMenu } from '@/redux/features/contextMenu/contextMenuSlice';
import { closeImageViewer } from '@/redux/features/imageViewer/imageViewerSlice';
import { useAppDispatch } from '@/redux/hooks';
import { Button } from '@/ui/button';
import { ContextMenuSeparator } from '@/ui/ContextMenu';
import { Icons } from '@skydock/ui/icons';

interface ImageViewerContextMenuProps {
    additionalData?: {
        currentImageId: string | null;
    };
}

const ImageViewerContextMenu = ({ additionalData }: ImageViewerContextMenuProps) => {
    const dispatch = useAppDispatch();
    const { downloadFile } = useFileDownloadWithProgress();

    const handleDownload = async () => {
        if (additionalData?.currentImageId) {
            //TODO: You'll need to implement this to get the file object
            const imageFile = { id: additionalData.currentImageId };
            // await downloadFile(imageFile);
        }
        dispatch(closeContextMenu());
    };

    const handleClose = () => {
        dispatch(closeImageViewer());
        dispatch(closeContextMenu());
    };

    return (
        <>
            <Button size={'menu'} onClick={handleDownload}>
                <div>Download</div>
                <Icons.Download className="h-4" />
            </Button>
            <ContextMenuSeparator />
            <Button size={'menu'} onClick={handleClose}>
                <div>Close</div>
                <Icons.Cross className="h-4" />
            </Button>
        </>
    );
};

export default ImageViewerContextMenu; 