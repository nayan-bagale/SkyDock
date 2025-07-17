import { useBrowserAPI } from '@/components/ContextApi/BrowserApi';
import useChangeAppFocus from '@/components/hooks/useChangeAppFocus';
import { useDrag } from '@/components/hooks/useDrag';
import { useEffectOnceSafe } from '@/components/hooks/useEffectOnceSafe';
import { closeCamera } from '@/redux/features/camera/cameraSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Button } from '@/ui/button';
import CameraCard from '@/ui/Cards/Camera/Camera';
import { AppsT } from '@skydock/types/enums';
import { showToast } from '@skydock/ui/toast';
import { Camera, Square, Video, Webcam } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';


const CameraApp = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [capturedMedia, setCapturedMedia] = useState<string[]>([]);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const { handleAppFocus } = useChangeAppFocus(AppsT.Camera);
    const { camera } = useBrowserAPI();
    const camerState = useAppSelector((state) => state.skydock.browserApis.camera);

    useEffectOnceSafe(() => {
        camera.start();
        console.log('starting camera')
        // return () => {
        //     camera.stop();
        // };
    });

    const capturePhoto = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        if (context) {
            context.drawImage(video, 0, 0);
            const photoUrl = canvas.toDataURL('image/jpeg', 0.9);
            setCapturedMedia(prev => [...prev, photoUrl]);

            showToast('Photo saved successfully!', 'success')
        }
    }, []);

    const startRecording = useCallback(() => {
        if (!videoRef.current?.srcObject) return;

        const stream = videoRef.current.srcObject as MediaStream;
        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9'
        });

        mediaRecorderRef.current = mediaRecorder;
        setRecordedChunks([]);

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                setRecordedChunks(prev => [...prev, event.data]);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const videoUrl = URL.createObjectURL(blob);
            setCapturedMedia(prev => [...prev, videoUrl]);

            showToast('Video saved successfully', 'success')

        };

        mediaRecorder.start();
        setIsRecording(true);
    }, [recordedChunks]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }, [isRecording]);

    const downloadMedia = useCallback((mediaUrl: string, index: number) => {
        const link = document.createElement('a');
        link.href = mediaUrl;
        link.download = mediaUrl.startsWith('data:image')
            ? `photo-${index + 1}.jpg`
            : `video-${index + 1}.webm`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, []);

    const dispatch = useAppDispatch();

    const draggableRef = useRef<HTMLDivElement>(null);
    const { position, handleMouseDown } = useDrag({
        ref: draggableRef,
    });

    const Action = {
        close: () => {
            dispatch(closeCamera());
            camera.stop();
        },
        minimize: () => {
            // Minimize the image viewer
        },
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // dispatch(openContextMenu({
        //     position: { x: e.clientX, y: e.clientY },
        //     location: 'imageViewer',
        //     additionalData: { currentImageId: imageViewerState?.currentImageId }
        // }));
    };

    return (
        <CameraCard
            ref={draggableRef}
            style={{ x: position.x, y: position.y }}
            isFocused={true}
            onMouseDown={handleMouseDown}
            action={Action}
            onMouseDownCard={handleAppFocus}
            theme={null}
            title="Camera App"
            onContextMenu={handleContextMenu}
        >
            {camerState?.permission !== 'Allowed' && (<div className='relative pt-0.5 pb-7 h-full w-full'>
                <div className='absolute gap-4 inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-10'>
                    <div className='relative'>
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                            <Webcam className="w-10 h-10 text-red-500" />
                        </div>
                        <div className="absolute inset-0 w-20 h-20 bg-red-200 rounded-full animate-ping opacity-20"></div>
                    </div>
                    <div className='inset-0 flex flex-col gap-2 items-center justify-center z-20'>

                        {camerState.permission === "Prompt" ? <>
                            <p className='text-white text-lg font-semibold'>Camera Permission Required</p>
                            <Button intent={'secondary'} size={'md'} onClick={() => camera.start()}>
                                Grant Permission
                            </Button>
                        </> : <p className='text-white text-lg font-semibold'>Enable camera permission from browser settings</p>}
                    </div>
                </div>
            </div>)}
            <div className=" relative pt-0.5 pb-7 h-full w-full ">
                <video
                    ref={camera.streamRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full object-fit h-full"
                />
                <div className="flex w-full absolute bottom-9 justify-center gap-4">
                    <Button className='p-2 rounded-full' onClick={capturePhoto} intent={'secondary'} size={'icon'}>
                        <Camera />
                    </Button>

                    {!isRecording ? (
                        <Button className='p-2 rounded-full' onClick={startRecording} intent={'secondary'} size={'icon'}>
                            <Video />
                        </Button>
                    ) : (
                        <Button className='p-2 bg-red-600 text-white rounded-full' onClick={stopRecording} intent={'destructive'} size={'icon'}>
                            <Square />
                        </Button>
                    )}
                </div>
            </div>


            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </CameraCard>
    );
};

export default CameraApp;