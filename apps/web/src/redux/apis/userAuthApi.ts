import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth from "./baseQueryWithReAuth";

// Define a service using a base URL and expected endpoints
const userAuthApi = createApi({
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

    sendEmailVerification: builder.mutation({
      query: (email) => ({
        url: `/auth/send-verification-email`,
        method: "GET",
        params: {
          email,
        },
      }),
    }),

    changeName: builder.mutation({
      query: (name) => ({
        url: `/auth/update/name`,
        method: "PATCH",
        body: name,
      }),
    }),

    changePassword: builder.mutation({
      query: (password) => ({
        url: `/auth/update/password`,
        method: "PUT",
        body: password,
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
  useSendEmailVerificationMutation,
  useChangeNameMutation,
  useChangePasswordMutation,
} = userAuthApi;
export default userAuthApi;
