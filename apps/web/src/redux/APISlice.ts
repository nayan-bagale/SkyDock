import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { AllFilesResponse } from "@repo/types";
import { logOut, setCredentials } from "./features/auth";
import { RootState } from "./store";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_BACKEND_URL}`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const { accessToken } = (getState() as RootState).auth;
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
    return headers;
  },
});

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, store, extraOptions) => {
  const result = await baseQuery(args, store, extraOptions);

  if (result.error?.status === 401 || result.error?.status === 403) {
    store.dispatch(logOut());
  }

  if (result.error?.status === 498) {
    const response = await baseQuery(
      `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
      store,
      extraOptions
    );

    if (response.data) {
      store.dispatch(setCredentials(response.data));
      return await baseQuery(args, store, extraOptions);
    } else if (
      response.error?.status === 401 ||
      response.error?.status === 403 ||
      response.error?.status === 500
    ) {
      store.dispatch(logOut());
      return response;
    }
  }

  return result;
};

// Define a service using a base URL and expected endpoints
const backendApi = createApi({
  reducerPath: "backendApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: `/auth/login`,
        method: "POST",
        body: { ...body },
      }),
    }),
    register: builder.mutation({
      query: (body) => ({
        url: `/auth/register`,
        method: "POST",
        body: { ...body },
      }),
    }),
    logOutApi: builder.mutation({
      query: () => `/auth/logout`,
    }),
    protected: builder.mutation({
      query: () => `/protected`,
    }),
    getSession: builder.query({
      query: () => `/session`,
    }),

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
  }),
});

// // Export hooks for usage in functional components, which are
// // auto-generated based on the defined endpoints
export const {
  useLoginMutation,
  useRegisterMutation,
  useProtectedMutation,
  useGetSessionQuery,
  useLogOutApiMutation,
  useGetUploadUrlsMutation,
  useUploadFilesMutation,
  useGetAllFilesQuery,
  useDeleteFileMutation,
  useGetFileUrlMutation,
} = backendApi;
export default backendApi;
