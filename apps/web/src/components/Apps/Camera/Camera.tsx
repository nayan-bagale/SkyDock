import { useBrowserAPI } from '@/components/ContextApi/BrowserApi';
import { useBlobFileGenerator } from '@/components/hooks/useBlobFileGenerator';
import useChangeAppFocus from '@/components/hooks/useChangeAppFocus';
import { useDrag } from '@/components/hooks/useDrag';
import { useEffectOnceSafe } from '@/components/hooks/useEffectOnceSafe';
import useFileUploadsAndUpdateState from '@/components/hooks/useFileUploadsAndUpdateState';
import { openSubscriptionPlanCard } from '@/redux/features/apps/appsSlice';
import { closeCamera } from '@/redux/features/camera/cameraSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Button } from '@/ui/button';
import CameraCard from '@/ui/Cards/Camera/Camera';
import { fileArrayGenerator } from '@/utils/file-array-generator';
import { AppsT, StorageLimit } from '@skydock/types/enums';
import { showToast } from '@skydock/ui/toast';
import { Camera, Database, Video, Webcam } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import fixWebmDuration from 'webm-duration-fix';


const CameraApp = () => {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const { handleAppFocus } = useChangeAppFocus(AppsT.Camera);
    const { camera } = useBrowserAPI();
    const cameraState = useAppSelector((state) => state.skydock.browserApis.camera);
    const dispatch = useAppDispatch();


    const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
    const availabeStorage = useAppSelector((state) => {
        const totalStorage = (state.auth.user?.plan.storageLimit ?? 0) - StorageLimit.MB_10;
        const usedStorage = state.auth.user?.usedStorage || 0;
        return totalStorage - usedStorage;
    });
    const [recordTime, setRecordTime] = useState(0); // in seconds
    const timerRef = useRef<NodeJS.Timeout | null>(null);



    const { generateFile } = useBlobFileGenerator();

    const [uploadFile] = useFileUploadsAndUpdateState();

    useEffectOnceSafe(() => {
        camera.start();
        console.log('starting camera')
        // return () => {
        //     camera.stop();
        // };
    });

    const handleUpgrade = useCallback(() => {
        dispatch(openSubscriptionPlanCard())

    }, [dispatch]);

    const capturePhoto = useCallback(async () => {
        if (!camera.streamRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const video = camera.streamRef.current;
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        if (context) {
            // Flip canvas horizontally
            context.translate(canvas.width, 0);
            context.scale(-1, 1);

            // Draw the mirrored image
            context.drawImage(video, 0, 0);
            const photoUrl = canvas.toDataURL('image/jpg', 0.9);
            // const file = dataURLToFile(photoUrl, `photo-${Date.now()}.jpg`);
            const file = generateFile({
                content: photoUrl,
                name: `photo-${Date.now()}`,
                type: 'jpg',
            })
            if (file) {
                await uploadFile(fileArrayGenerator([file], 'pictures'));
                // showToast('Photo successfully saved in pictures.', 'success')

            }
            // Reset transform so future drawings aren’t flipped
            context.setTransform(1, 0, 0, 1, 0, 0);
        }
    }, [camera.streamRef, generateFile, uploadFile]);


    const startRecording = useCallback(() => {
        if (!camera.streamRef.current?.srcObject) return;

        const video = camera.streamRef.current;
        const originalStream = video.srcObject as MediaStream;
        const audioTracks = originalStream.getAudioTracks(); // Get mic audio

        const canvas = canvasRef.current!;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d")!;
        let animationFrameId: number;

        const drawMirroredVideo = () => {
            context.save();
            context.scale(-1, 1); // mirror the video
            context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
            context.restore();
            animationFrameId = requestAnimationFrame(drawMirroredVideo);
        };

        drawMirroredVideo();

        const mirroredVideoStream = canvas.captureStream(30); // 30fps
        const combinedStream = new MediaStream([
            ...mirroredVideoStream.getVideoTracks(),
            ...audioTracks, // add audio from the original stream
        ]);

        const mediaRecorder = new MediaRecorder(combinedStream, {
            mimeType: 'video/webm;codecs=vp9'
        });

        mediaRecorderRef.current = mediaRecorder;
        let recordedChunks: Blob[] = [];
        let totalSize = 0;


        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
                totalSize += event.data.size;
                console.log(`Recorded chunk size: ${event.data.size}, Total size: ${totalSize}, Available storage: ${availabeStorage}`);
                if (totalSize >= availabeStorage) {
                    if (mediaRecorderRef.current?.state === 'recording') {
                        mediaRecorderRef.current.stop();
                    }
                }
            }
        };

        mediaRecorder.onstop = async () => {
            cancelAnimationFrame(animationFrameId);

            if (totalSize >= availabeStorage) {
                while (totalSize >= availabeStorage && recordedChunks.length > 0) {
                    const lastChunk = recordedChunks.pop();
                    totalSize -= lastChunk?.size || 0;
                }

                setIsRecording(false);

                if (recordedChunks.length === 0) {
                    showToast('No video recorded due to storage limit.', 'error');
                    return;
                } else {
                    setTimeout(() => {
                        showToast('Max storage size reached, stopping recording...', 'error');
                    }, 1000);
                }
            }


            const fixedBlob = await fixWebmDuration(new Blob(recordedChunks, { type: 'video/webm' }));


            const file = generateFile({
                content: [fixedBlob],
                name: `video-${Date.now()}`,
                type: 'webm',
            });

            if (file) {
                uploadFile(fileArrayGenerator([file], 'videos'));
            }

            recordedChunks = [];
        };

        mediaRecorder.start(1000);

        setRecordTime(0);
        timerRef.current = setInterval(() => {
            setRecordTime(prev => prev + 1);
        }, 1000);
        setIsRecording(true);
    }, [availabeStorage, camera.streamRef, generateFile, uploadFile]);


    const stopRecording = useCallback(() => {
        setIsRecording(false);
        setTimeout(() => {
            if (mediaRecorderRef.current && isRecording) {
                mediaRecorderRef.current.requestData();
                mediaRecorderRef.current.stop();
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }, 500);
    }, [isRecording]);


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

    const disabledButtons = useMemo(() => {
        if (availabeStorage <= 0) {
            return true;
        }
        return false;
    }, [availabeStorage]);


    const StorageLimitComponent = useMemo(() => {
        return (
            <div className='absolute gap-4 inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-10'>
                <div className='relative'>
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center animate-pulse">
                        <Database className="w-10 h-10 text-yellow-500" />
                    </div>
                    <div className="absolute inset-0 w-20 h-20 bg-yellow-200 rounded-full animate-ping opacity-20"></div>
                </div>
                <div className='inset-0 flex flex-col gap-2 items-center justify-center z-20'>
                    <p className='text-gray-200 text-center text-sm font-semibold'>
                        You have reached your storage limit.
                        <br />
                        Please upgrade your plan to continue using the Camera app.
                        <br />
                        or free up some space.
                    </p>
                    <Button onClick={handleUpgrade} size='sm' intent={'cta'} className="bg-gradient-to-r from-lime-400 to-lime-500 text-white">Upgrade Plan</Button>
                </div>
            </div>)
    }, [handleUpgrade])

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
            <div className=" relative pt-0.5 pb-7 h-full w-full ">
                <video
                    ref={camera.streamRef}
                    autoPlay
                    playsInline
                    muted

                    className="w-full object-fit h-full -scale-x-100"
                />
                {availabeStorage <= 0 ? (StorageLimitComponent) : (
                    (cameraState?.permission !== 'Allowed' ? (
                        <div className='absolute gap-4 inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-10'>
                            <div className='relative'>
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                                    <Webcam className="w-10 h-10 text-red-500" />
                                </div>
                                <div className="absolute inset-0 w-20 h-20 bg-red-200 rounded-full animate-ping opacity-20"></div>
                            </div>
                            <div className='inset-0 flex flex-col gap-2 items-center justify-center z-20'>

                                {cameraState.permission === "Prompt" ? <>
                                    <p className='text-white text-lg font-semibold'>Camera Permission Required</p>
                                    <Button intent={'secondary'} size={'md'} onClick={() => camera.start()}>
                                        Grant Permission
                                    </Button>
                                </> : <p className='text-white text-lg font-semibold'>Enable camera permission from browser settings</p>}
                            </div>
                        </div>) :

                        <div className="flex w-full absolute bottom-9 justify-center gap-4">
                            {!isRecording && <Button className='p-2 rounded-full' disabled={disabledButtons || isRecording} onClick={capturePhoto} intent={'secondary'} size={'icon'}>
                                <Camera />
                            </Button>}

                            {!isRecording ? (
                                <Button layoutId='record' className='p-2 rounded-full' disabled={disabledButtons} onClick={startRecording} intent={'secondary'} size={'icon'}>
                                    <Video />
                                </Button>
                            ) : (
                                <Button layoutId='record' className='p-2 px-3 bg-red-600 text-white rounded-full' disabled={disabledButtons} onClick={stopRecording} intent={'destructive'} size={'icon'}>
                                    {Math.floor(recordTime / 60)}:{('0' + (recordTime % 60)).slice(-2)}
                                </Button>
                            )}
                            {/* {isRecording && (
                                <div className='text-white text-sm font-semibold'>
                                    {Math.floor(recordTime / 60)}:{('0' + (recordTime % 60)).slice(-2)}
                                </div>
                            )} */}
                        </div>
                    )

                )}
            </div>
        </CameraCard>
    );
};

export default CameraApp;