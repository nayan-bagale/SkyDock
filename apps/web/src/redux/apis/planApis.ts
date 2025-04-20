import { createApi } from "@reduxjs/toolkit/query/react";
import { PlansT } from "@skydock/types";
import baseQueryWithReAuth from "./baseQueryWithReAuth";

// Define a service using a base URL and expected endpoints
const planApi = createApi({
  reducerPath: "planApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Plans"],
  endpoints: (builder) => ({
    getAllPlans: builder.query<PlansT, void>({
      query: () => "/plan/get-all",
      providesTags: ["Plans"],
    }),
  }),
});

export const { useGetAllPlansQuery } = planApi;
export default planApi;
