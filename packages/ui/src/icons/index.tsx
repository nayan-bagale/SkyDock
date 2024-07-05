import { cn } from "../utils"

import python_image from './assests/python-svgrepo-com.svg';
import react_svg from './assests/react-svgrepo-com.svg';
import terminal_svg from './assests/terminal-svgrepo-com.svg';
import docker_svg from './assests/docker-svgrepo-com.svg';
import folder_svg from './assests/default-folder-svgrepo-com.svg'
import vite_svg from './assests/vite-svgrepo-com.svg'
import vscode_svg from './assests/sln-svgrepo-com.svg'
import menu_svg from './assests/mjml-svgrepo-com.svg'

const $ = ({ svg, name, className }: { svg: any, name: string, className: string }) => (<img src={svg} className={cn(className)} alt={name}/>)

export const Icons = {
  React: ({className}:{className:string}) => $({ svg: react_svg, name: 'react', className}),
  Python: ({className}:{className:string}) => $({ svg: python_image, name: 'python', className}),
  Terminal: ({ className }: { className: string }) => $({ svg: terminal_svg, name: 'terminal', className}),
  Docker: ({ className }: { className: string }) => $({ svg: docker_svg, name: 'docker', className}),
  Folder: ({ className }: { className: string }) => $({ svg: folder_svg, name: 'folder', className}),
  Vite: ({ className }: { className: string }) => $({ svg: vite_svg, name: 'vite', className}),
  VSCode: ({ className }: { className: string }) => $({ svg: vscode_svg, name: 'vscode', className}),
  Menu: ({ className }: { className: string }) => $({ svg: menu_svg, name: 'menu', className }),
}

