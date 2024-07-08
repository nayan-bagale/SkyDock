import useOnClickOutside from '@/components/hooks/useOnclickOutside';
import { FileT } from '@/redux/features/files/filesSlice';
import { useAppSelector } from '@/redux/hooks';
import { Button, ContextMenu, ContextMenuSeparator, ContextMenuSub, DisplayFilesIcons } from '@repo/ui';
import { Icons } from '@repo/ui/icons';

import React, { FC, useRef, useState } from 'react';




const FileWrapper: FC<{ file: FileT, Icon: any }> = ({ file, Icon }) => {
  const [contextMenu, SetContextMenu] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null)

  useOnClickOutside(ref, () => SetContextMenu(false));

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>,) => {
    e.preventDefault();
    SetContextMenu(!contextMenu);
    setPosition({ x: e.clientX, y: e.clientY });
  }

  return (
    <>
      <DisplayFilesIcons Icon={Icon} file={file} onContextMenu={handleContextMenu} />
      {contextMenu && (
        <ContextMenu ref={ref} position={position}>
          <Button size={'menu'} className=" ">
            Open
          </Button>

          <ContextMenuSub name="Open in">
            <Button size={'menu'}>
              New Tab
            </Button>
          </ContextMenuSub>

          <Button size={'menu'} className=" ">
            Download
          </Button>
          <ContextMenuSeparator />
          <Button size={'menu'} className=" hover:bg-red-600">
            <div>Delete</div>
            <Icons.Trash className=" h-4" />
          </Button>
        </ContextMenu>
      )}
    </>
  )
}


const FileIcon: FC<{ file: FileT }> = ({ file }) => {

  const imageTypes = ['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/x-jps', 'image/png', 'image/gif', 'image/webp'];

  if (imageTypes.includes(file.type)) {
    return (<FileWrapper Icon={Icons.Image} file={file} />);
  }

  switch (file.type) {
    case 'application/pdf':
      return (<FileWrapper Icon={Icons.PDF} file={file} />);
    default:
      return (<FileWrapper Icon={Icons.File} file={file} />);
  }

}


interface FliesProps {
  children?: React.ReactNode;
  className?: string;
}

const Files: FC<FliesProps> = () => {
  const files = useAppSelector((state: any) => state.files.files);

  return (
    <div >
      {files.map((file: FileT) => (
        <FileIcon key={file.id} file={file} />
      ))}
    </div>
  )
}

export default Files