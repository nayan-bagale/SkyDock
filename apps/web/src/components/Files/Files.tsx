import { FileT } from '@/redux/features/files/filesSlice';
import { useAppSelector } from '@/redux/hooks';
import { DisplayFilesIcons } from '@repo/ui';
import { Icons } from '@repo/ui/icons';

import React, { FC } from 'react'

interface FliesProps {
  children?: React.ReactNode;
  className?: string;
}


const FileIcon: FC<{ file: FileT }> = ({ file }) => {
  console.log(file)
  const imageTypes = ['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/x-jps', 'image/png', 'image/gif', 'image/webp'];

  if (imageTypes.includes(file.type)){
    return (<DisplayFilesIcons Icon={Icons.Image} file={file} />);
  }

  switch (file.type) {
    case 'application/pdf':
      return (<DisplayFilesIcons Icon={Icons.PDF} file={file} />);
    default:
      return (<DisplayFilesIcons Icon={Icons.File} file={file} />);
  }

}

const Files: FC<FliesProps> = () => {
  const files = useAppSelector((state: any) => state.files);
  console.log(files)
  return (
    <div >
      {files.map((file: FileT) => (
          <FileIcon key={file.id} file={file} />
      ))}
    </div>
  )
}

export default Files