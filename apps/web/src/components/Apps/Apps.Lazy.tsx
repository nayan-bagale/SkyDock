import { lazy } from 'react'

export const Terminal = lazy(() => import('@/components/Apps/terminal/Terminal'))
export const Explorer = lazy(() => import('@/components/Apps/Explorer/Explorer'))
export const Settings = lazy(() => import('@/components/Apps/Settings/Settings'))
export const ImageViewer = lazy(() => import('@/components/Apps/ImageViewer/ImageViewer'))
export const MusicPlayer = lazy(() => import('@/components/Apps/MusicPlayer/MusicPlayer'))
export const VideoPlayer = lazy(() => import('@/components/Apps/VideoPlayer/VideoPlayer'))
export const PdfReader = lazy(() => import('@/components/Apps/PdfReader/PdfReader'))

// System Elements
export const AppsMenu = lazy(() => import('@/components/AppsMenu/AppsMenu'))