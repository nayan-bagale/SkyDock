import { cn } from "../utils";

import logo_svg from './assests/cat-svgrepo-com.svg';
import cloud_svg from './assests/cloud-storage-upload-up-arrow-svgrepo-com.svg';
import control_center_svg from './assests/control-centre-svgrepo-com.svg';
import cross_svg from './assests/cross-svgrepo-com.svg';
import trash_svg from './assests/delete-svgrepo-com.svg';
import docker_svg from './assests/docker-svgrepo-com.svg';
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
import menu_svg from './assests/mjml-svgrepo-com.svg';
import pdf_svg from './assests/pdf-svgrepo-com-1.svg';
import image_svg from './assests/picture-photo-image-svgrepo-com.svg';
import python_image from './assests/python-svgrepo-com.svg';
import react_svg from './assests/react-svgrepo-com.svg';
import right_arrow2_svg from './assests/right-arrow-backup-2-svgrepo-com.svg';
import right_arrow_svg from './assests/right-arrow-svgrepo-com.svg';
import select_multiple_svg from './assests/select-multiple-svgrepo-com.svg';
import settings_svg from './assests/settings-svgrepo-com.svg';
import vscode_svg from './assests/sln-svgrepo-com.svg';
import spinner_svg from './assests/spinner-svgrepo-com.svg';
import terminal_svg from './assests/terminal-svgrepo-com.svg';
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
}

