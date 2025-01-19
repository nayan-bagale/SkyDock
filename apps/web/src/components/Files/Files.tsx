// import useOnClickOutside from '@/components/hooks/useOnclickOutside';
// import { useDeleteFileMutation } from '@/redux/APISlice';
// import { FileT } from '@/redux/features/explorer/explorerSlice';
// import { useAppDispatch, useAppSelector } from '@/redux/hooks';
// import { Button } from '@/ui/button';
// import { ContextMenu, ContextMenuSeparator } from '@/ui/ContextMenu';
// import { DisplayItemsIcons } from '@/ui/DisplayFilesIcons';
// // import { Button, ContextMenu, ContextMenuSeparator, DisplayFilesIcons } from '@repo/ui';
// import { Icons } from '@repo/ui/icons';

// import React, { FC, useRef, useState } from 'react';


// const FileWrapper: FC<{ file: FileT, Icon: any }> = ({ file, Icon }) => {
//   const [contextMenu, SetContextMenu] = useState(false);
//   const [deleteFile] = useDeleteFileMutation()
//   // const [position, setPosition] = useState({ x: 0, y: 0 });
//   const ref = useRef<HTMLDivElement>(null)
//   const dispatch = useAppDispatch()

//   const view = useAppSelector((state: any) => state.filesexplorer.view).view

//   const position = view === 'grid' ? ' left-4' : ' left-12'

//   useOnClickOutside(ref, () => SetContextMenu(false));

//   const handleContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>,) => {
//     e.preventDefault();
//     SetContextMenu(!contextMenu);
//     // setPosition({ x: e.clientX, y: e.clientY });
//   }

//   const handleDelete = async () => {
//     try {
//       await deleteFile(file.id)
//       // dispatch(deleteItem(file.id))
//       console.log("file deleted")

//     } catch (error) {
//       console.log(error)
//     }
//   }


//   return (
//     <div className={`relative ${view === 'row' && ' w-full'} `}>
//       <DisplayItemsIcons view={view} Icon={Icon} file={file} onContextMenu={handleContextMenu} />
//       {contextMenu && (
//         <ContextMenu ref={ref} className={position}>
//           <Button size={'menu'} className=" ">
//             Open
//           </Button>
//           <Button size={'menu'} className=" ">
//             Download
//           </Button>
//           <ContextMenuSeparator />
//           <Button size={'menu'} className=" hover:bg-red-600" onClick={handleDelete}>
//             <div>Delete</div>
//             <Icons.Trash className=" h-4" />
//           </Button>
//         </ContextMenu>
//       )}
//     </div>
//   )
// }


// const FileIcon: FC<{ file: FileT }> = ({ file }) => {

//   const imageTypes = ['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/x-jps', 'image/png', 'image/gif', 'image/webp'];

//   if (imageTypes.includes(file.details.type)) {
//     return (<FileWrapper Icon={Icons.Image} file={file} />);
//   }

//   switch (file.details.type) {
//     case 'application/pdf':
//       return (<FileWrapper Icon={Icons.PDF} file={file} />);
//     default:
//       return (<FileWrapper Icon={Icons.File} file={file} />);
//   }

// }


// interface FliesProps {
//   children?: React.ReactNode;
//   className?: string;
// }

// const Files: FC<FliesProps> = () => {
//   const files = useAppSelector((state) => state.files.files);
//   const view = useAppSelector((state) => state.filesexplorer.view)?.view;


//   return (
//     <div className={view === 'grid' ? 'flex gap-2 items-start justify-start flex-wrap ' : '  '}>
//       {files.map((file: FileT) => (
//         <FileIcon key={file.id} file={file} />
//       ))}
//     </div>
//   )
// }

// export default Files