import { useDrag } from '@/components/hooks/useDrag';
import { Button } from '@/ui/button';
import CameraCard from '@/ui/Cards/Camera/Camera';
import { showToast } from '@skydock/ui/toast';
import { Camera, Square, Video } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';


const CameraApp = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [capturedMedia, setCapturedMedia] = useState<string[]>([]);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720 },
                audio: true
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsStreaming(true);
            }
        } catch (error) {
            showToast('Unable to access camera. Please check permissions.', 'error')

        }
    }, []);

    const stopCamera = useCallback(() => {
        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setIsStreaming(false);
        }
    }, []);

    useEffect(() => {
        if (!isStreaming) {
            startCamera();
        } else {
            stopCamera();
        }

        return () => {
            stopCamera();
        };
    }, []);

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

    const draggableRef = useRef<HTMLDivElement>(null);
    const { position, handleMouseDown } = useDrag({
        ref: draggableRef,
    });

    const Action = {
        close: () => {
            // dispatch(closeVideoPlayer());

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
            onMouseDownCard={() => { }}
            theme={null}
            title="Camera App"
            onContextMenu={handleContextMenu}
        >
            {/* <div className="flex absolute h-full inset-0 backdrop-blur justify-center gap-4">
                {!isStreaming ? (
                    <Button onClick={startCamera} size="lg">
                        <Camera className="mr-2" />
                        Start Camera
                    </Button>
                ) : (
                    <Button onClick={stopCamera} variant="destructive" size="lg">
                        <Square className="mr-2" />
                        Stop Camera
                    </Button>
                )}
            </div> */}
            <div className=" relative pt-0.5 pb-7 h-full w-full ">

                {/* <div className="space-y-4 relative"> */}


                {/* {isStreaming && ( */}
                {/* <div className="relative overflow-hidden"> */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full object-fit h-full"
                />
                {/* </div> */}
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
                {/* )} */}
                {/* </div> */}
            </div>

            {/* {capturedMedia.length > 0 && (
                    <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
                        <h2 className="text-2xl font-bold mb-4">Captured Media</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {capturedMedia.map((mediaUrl, index) => (
                                <div key={index} className="space-y-2">
                                    {mediaUrl.startsWith('data:image') ? (
                                        <img
                                            src={mediaUrl}
                                            alt={`Captured photo ${index + 1}`}
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                    ) : (
                                        <video
                                            src={mediaUrl}
                                            controls
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                    )}
                                    <Button
                                        onClick={() => downloadMedia(mediaUrl, index)}
                                        size="sm"
                                        className="w-full"
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Download
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )} */}

            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </CameraCard>
    );
};

export default CameraApp;