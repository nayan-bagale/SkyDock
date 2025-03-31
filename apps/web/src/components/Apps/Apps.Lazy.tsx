import { lazy } from 'react'

export const Terminal = lazy(() => import('@/components/Apps/terminal/Terminal'))
export const Explorer = lazy(() => import('@/components/Apps/Explorer/Explorer'))
export const Settings = lazy(() => import('@/components/Apps/Settings/Settings'))
export const ImageViewer = lazy(() => import('@/components/Apps/ImageViewer/ImageViewer'))