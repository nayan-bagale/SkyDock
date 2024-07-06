import { cn } from "../utils";

import logo_svg from './assests/cat-svgrepo-com.svg';
import control_center_svg from './assests/control-centre-svgrepo-com.svg';
import docker_svg from './assests/docker-svgrepo-com.svg';
import file_svg from './assests/file-svgrepo-com.svg';
import folder_svg from './assests/folder-archive-documents-open-svgrepo-com.svg';
import menu_svg from './assests/mjml-svgrepo-com.svg';
import pdf_svg from './assests/pdf-svgrepo-com-1.svg';
import image_svg from './assests/picture-photo-image-svgrepo-com.svg';
import python_image from './assests/python-svgrepo-com.svg';
import react_svg from './assests/react-svgrepo-com.svg';
import vscode_svg from './assests/sln-svgrepo-com.svg';
import terminal_svg from './assests/terminal-svgrepo-com.svg';
import upload_svg from './assests/upload-svgrepo-com.svg';
import vite_svg from './assests/vite-svgrepo-com.svg';

const $ = ({ svg, name, className }: { svg: any, name: string, className: string }) => (<img src={svg} className={cn(className)} alt={name} />)

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
  Logo: ({ className }: { className: string }) => $({ svg: logo_svg, name: 'logo', className })
}

