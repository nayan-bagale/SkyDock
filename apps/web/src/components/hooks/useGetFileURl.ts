import { useGetFileUrlMutation } from "@/redux/apis/filesAndFolderApi";

const useGetFileURl = () => {
  const [getFileUrl] = useGetFileUrlMutation();

  const getImageUrl = async (id: string) => {
    return await getFileUrl(id).unwrap();
  };

  return { getImageUrl };
};

export default useGetFileURl;
