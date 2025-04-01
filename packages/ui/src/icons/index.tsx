import { cn } from "../utils";

import account_svg from './assests/account-avatar-multimedia-svgrepo-com.svg';
import logo_svg from './assests/cat-svgrepo-com.svg';
import paste_svg from './assests/clipboard-svgrepo-com.svg';
import cloud_svg from './assests/cloud-storage-upload-up-arrow-svgrepo-com.svg';
import control_center_svg from './assests/control-centre-svgrepo-com.svg';
import copy_svg from './assests/copy-svgrepo-com.svg';
import cross_svg from './assests/cross-svgrepo-com.svg';
import trash_svg from './assests/delete-svgrepo-com.svg';
import docker_svg from './assests/docker-svgrepo-com.svg';
import dollar_svg from './assests/dollar-svgrepo-com.svg';
import download_svg from './assests/download-svgrepo-com.svg';
import exclamation_svg from './assests/exclamation-mark-in-a-circle-svgrepo-com.svg';
import closed_eye_svg from './assests/eye-closed-svgrepo-com.svg';
import eye_svg from './assests/eye-svgrepo-com.svg';
import file_svg from './assests/file-svgrepo-com.svg';
import folder_add_svg from './assests/folder-add-svgrepo-com.svg';
import folder_svg from './assests/folder-archive-documents-open-svgrepo-com.svg';
import folder2_svg from './assests/folder-svgrepo-com.svg';
import full_screen_exit_svg from './assests/full-screen-exit-svgrepo-com.svg';
import full_screen_svg from './assests/full-screen-svgrepo-com.svg';
import grid2_svg from './assests/grid-2-horizontal-svgrepo-com.svg';
import grid4_svg from './assests/grid-4-svgrepo-com.svg';
import home_svg from './assests/home-svgrepo-com.svg';
import left_arrow from './assests/left-arrow-backup-2-svgrepo-com.svg';
import loader_svg from './assests/loading-loader-svgrepo-com.svg';
import lock_svg from './assests/lock-svgrepo-com.svg';
import logout_svg from './assests/logout-svgrepo-com.svg';
import zoom_in_svg from './assests/magnifer-zoom-in-svgrepo-com.svg';
import zoom_out_svg from './assests/magnifer-zoom-out-svgrepo-com.svg';
import menu_svg from './assests/mjml-svgrepo-com.svg';
import move_svg from './assests/move-to-folder-svgrepo-com.svg';
import paint_svg from './assests/paint-svgrepo-com.svg';
import pdf_svg from './assests/pdf-svgrepo-com-1.svg';
import image_svg from './assests/picture-photo-image-svgrepo-com.svg';
import pie_svg from './assests/pie-chart-svgrepo-com.svg';
import python_image from './assests/python-svgrepo-com.svg';
import react_svg from './assests/react-svgrepo-com.svg';
import reset_svg from './assests/reset-svgrepo-com.svg';
import right_arrow2_svg from './assests/right-arrow-backup-2-svgrepo-com.svg';
import right_arrow_white from './assests/right-arrow-backup-2-white-svgrepo-com.svg';
import right_arrow_svg from './assests/right-arrow-svgrepo-com.svg';
import rotate_svg from './assests/rotate-right-1-svgrepo-com.svg';
import select_multiple_svg from './assests/select-multiple-svgrepo-com.svg';
import settings2_svg from './assests/settings-2-svgrepo-com.svg';
import settings_svg from './assests/settings-svgrepo-com.svg';
import vscode_svg from './assests/sln-svgrepo-com.svg';
import spinner_svg from './assests/spinner-svgrepo-com.svg';
import terminal_svg from './assests/terminal-svgrepo-com.svg';
import rename_svg from './assests/text-field-focus-svgrepo-com.svg';
import trash_svg3 from './assests/trash-bin-minimalistic-svgrepo-com.svg';
import trash_svg2 from './assests/trash-bin-trash-svgrepo-com.svg';
import upload_svg from './assests/upload-svgrepo-com.svg';
import user_svg from './assests/user-circle-svgrepo-com.svg';
import vite_svg from './assests/vite-svgrepo-com.svg';

const $ = ({ svg, name, className }: { svg: any, name: string, className?: string }) => (<img src={svg} className={cn(className)} alt={name} />)

export const Icons = {
  React: ({ className }: { className: string }) => $({ svg: react_svg, name: 'react', className }),
  Python: ({ className }: { className: string }) => $({ svg: python_image, name: 'python', className }),
  Terminal: ({ className }: { className: string }) => $({ svg: terminal_svg, name: 'terminal', className }),
  Docker: ({ className }: { className: string }) => $({ svg: docker_svg, name: 'docker', className }),
  Folder: ({ className }: { className: string }) => $({ svg: folder_svg, name: 'folder', className }),
  Vite: ({ className }: { className: string }) => $({ svg: vite_svg, name: 'vite', className }),
  VSCode: ({ className }: { className: string }) => $({ svg: vscode_svg, name: 'vscode', className }),
  Menu: ({ className }: { className: string }) => $({ svg: menu_svg, name: 'menu', className }),
  Control_Center: ({ className }: { className: string }) => $({ svg: control_center_svg, name: 'control_center', className }),
  Upload: ({ className }: { className: string }) => $({ svg: upload_svg, name: 'upload', className }),
  PDF: ({ className }: { className: string }) => $({ svg: pdf_svg, name: 'pdf', className }),
  Image: ({ className }: { className: string }) => $({ svg: image_svg, name: 'image', className }),
  File: ({ className }: { className: string }) => $({ svg: file_svg, name: 'file', className }),
  Logo: ({ className }: { className: string }) => $({ svg: logo_svg, name: 'logo', className }),
  Right_Arrow: ({ className }: { className: string }) => $({ svg: right_arrow_svg, name: 'right_arrow', className }),
  Trash: ({ className }: { className: string }) => $({ svg: trash_svg, name: 'trash', className }),
  Cross: ({ className }: { className: string }) => $({ svg: cross_svg, name: 'cross', className }),
  Left_Arrow: ({ className }: { className: string }) => $({ svg: left_arrow, name: 'left_arrow', className }),
  Right_Arrow2: ({ className }: { className: string }) => $({ svg: right_arrow2_svg, name: 'right_arrow', className }),
  Grid4: ({ className }: { className: string }) => $({ svg: grid4_svg, name: 'grid-4', className }),
  Grid2: ({ className }: { className: string }) => $({ svg: grid2_svg, name: 'grid-2', className }),
  Cloud: ({ className }: { className: string }) => $({ svg: cloud_svg, name: 'cloud', className }),
  Folder2: ({ className }: { className: string }) => $({ svg: folder2_svg, name: 'folder2', className }),
  Home: ({ className }: { className: string }) => $({ svg: home_svg, name: 'home', className }),
  Select_Multiple: ({ className }: { className: string }) => $({ svg: select_multiple_svg, name: 'select_multiple', className }),
  Folder_Add: ({ className }: { className: string }) => $({ svg: folder_add_svg, name: 'folder_add', className }),
  Eye: ({ className }: { className: string }) => $({ svg: eye_svg, name: 'eye', className }),
  Closed_Eye: ({ className }: { className: string }) => $({ svg: closed_eye_svg, name: 'closed_eye', className }),
  Loader: ({ className }: { className: string }) => $({ svg: loader_svg, name: 'loader', className }),
  Spinner: ({ className }: { className?: string }) => $({ svg: spinner_svg, name: 'spinner', className }),
  User: ({ className }: { className: string }) => $({ svg: user_svg, name: 'user', className }),
  Full_Screen: ({ className }: { className: string }) => $({ svg: full_screen_svg, name: 'full_screen', className }),
  Full_Screen_Exit: ({ className }: { className: string }) => $({ svg: full_screen_exit_svg, name: 'full_screen_exit', className }),
  Settings: ({ className }: { className: string }) => $({ svg: settings_svg, name: 'settings', className }),
  Lock: ({ className }: { className: string }) => $({ svg: lock_svg, name: 'lock', className }),
  Logout: ({ className }: { className: string }) => $({ svg: logout_svg, name: 'logout', className }),
  Trash2: ({ className }: { className: string }) => $({ svg: trash_svg2, name: 'trash', className }),
  Settings2: ({ className }: { className: string }) => $({ svg: settings2_svg, name: 'settings', className }),
  Paint: ({ className }: { className: string }) => $({ svg: paint_svg, name: 'paint', className }),
  Pie: ({ className }: { className: string }) => $({ svg: pie_svg, name: 'pie', className }),
  Account: ({ className }: { className: string }) => $({ svg: account_svg, name: 'account', className }),
  Dollar: ({ className }: { className: string }) => $({ svg: dollar_svg, name: 'dollar', className }),
  Exclamation: ({ className }: { className: string }) => $({ svg: exclamation_svg, name: 'exclamation', className }),
  Right_Arrow_White: ({ className }: { className: string }) => $({ svg: right_arrow_white, name: 'right_arrow_white', className }),
  Move: ({ className }: { className: string }) => $({ svg: move_svg, name: 'move', className }),
  Copy: ({ className }: { className: string }) => $({ svg: copy_svg, name: 'copy', className }),
  Download: ({ className }: { className: string }) => $({ svg: download_svg, name: 'download', className }),
  Trash3: ({ className }: { className: string }) => $({ svg: trash_svg3, name: 'trash', className }),
  Rename: ({ className }: { className: string }) => $({ svg: rename_svg, name: 'rename', className }),
  Paste: ({ className }: { className: string }) => $({ svg: paste_svg, name: 'paste', className }),
  Zoom_In: ({ className }: { className: string }) => $({ svg: zoom_in_svg, name: 'zoom_in', className }),
  Zoom_Out: ({ className }: { className: string }) => $({ svg: zoom_out_svg, name: 'zoom_out', className }),
  Reset: ({ className }: { className: string }) => $({ svg: reset_svg, name: 'reset', className }),
  Rotate: ({ className }: { className: string }) => $({ svg: rotate_svg, name: 'rotate', className }),

}

