import { createApi } from "@reduxjs/toolkit/query/react";
import { AllFilesResponse, PatchItemRequest } from "@skydock/types";
import baseQueryWithReAuth from "./baseQueryWithReAuth";

// Define a service using a base URL and expected endpoints
const filesAndFolderApi = createApi({
  reducerPath: "filesAndFolderApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    // File Handling Apis (Upload and Download)
    getUploadUrls: builder.mutation({
      query: (files) => ({
        url: "/files/generate-upload-urls",
        method: "POST",
        body: { files },
      }),
    }),

    uploadFiles: builder.mutation({
      query: (body) => ({
        url: "/files/upload",
        method: "POST",
        body,
      }),
    }),

    getAllFiles: builder.query<AllFilesResponse[], any>({
      query: () => "/files",
    }),

    getFileUrl: builder.mutation<{ url: string }, any>({
      query: (id: string) => ({
        url: `/file/${id}`,
        method: "GET",
      }),
    }),

    deleteFile: builder.mutation({
      query: (id: string) => ({
        url: `/file/${id}`,
        method: "DELETE",
      }),
    }),

    updateItem: builder.mutation({
      query: ({ id, ...fields }: PatchItemRequest) => ({
        url: `/file/${id}`,
        method: "PATCH",
        body: { ...fields },
      }),
    }),

    createFolder: builder.mutation({
      query: (body: any) => ({
        url: `/folder/create`,
        method: "POST",
        body,
      }),
    }),

    deleteFolder: builder.mutation({
      query: (body: any) => ({
        url: `/folder/delete`,
        method: "POST",
        body,
      }),
    }),
  }),
});

// // Export hooks for usage in functional components, which are
// // auto-generated based on the defined endpoints
export const {
  useGetUploadUrlsMutation,
  useUploadFilesMutation,
  useGetAllFilesQuery,
  useDeleteFileMutation,
  useGetFileUrlMutation,
  useUpdateItemMutation,
  useCreateFolderMutation,
  useDeleteFolderMutation,
} = filesAndFolderApi;
export default filesAndFolderApi;
