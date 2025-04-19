import { createApi } from "@reduxjs/toolkit/query/react";
import { LoginResponse } from "@skydock/types/Auth";
import { setUserInfo } from "../features/auth";
import baseQueryWithReAuth from "./baseQueryWithReAuth";

// Define a service using a base URL and expected endpoints
const userAuthApi = createApi({
  reducerPath: "backendApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["UserInfo"],
  endpoints: (builder) => ({
    login: builder.mutation<{ accessToken: string; user: LoginResponse }, any>({
      query: (body) => ({
        url: `/auth/login`,
        method: "POST",
        body: { ...body },
      }),
      invalidatesTags: ["UserInfo"],
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
      invalidatesTags: ["UserInfo"],
    }),

    changePassword: builder.mutation({
      query: (password) => ({
        url: `/auth/update/password`,
        method: "PUT",
        body: password,
      }),
    }),

    sendOtp: builder.mutation({
      query: (email) => ({
        url: `/auth/send-otp`,
        method: "GET",
        params: {
          email,
        },
      }),
    }),
    verifyOtp: builder.mutation({
      query: (body: { email: string; otp: string }) => ({
        url: `/auth/verify-otp`,
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation({
      query: (body: { email: string; password: string }) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body,
      }),
    }),
    getUserInfo: builder.query({
      query: () => ({
        url: `/auth/user-info`,
        method: "GET",
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        console.log(data);
        dispatch(setUserInfo(data));
      },
      providesTags: ["UserInfo"],
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
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useGetUserInfoQuery,
} = userAuthApi;
export default userAuthApi;
