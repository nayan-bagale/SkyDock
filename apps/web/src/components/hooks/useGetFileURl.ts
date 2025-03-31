import { useGetFileUrlMutation } from "@/redux/APISlice";

const useGetFileURl = () => {
  const [getFileUrl] = useGetFileUrlMutation();

  const getImageUrl = async (id: string) => {
    return await getFileUrl(id).unwrap();
  };

  return { getImageUrl };
};

export default useGetFileURl;
