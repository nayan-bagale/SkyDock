import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { logOut, setAccessToken } from "../features/auth";
import { RootState } from "../store";

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
      const { accessToken } = response.data as { accessToken: string };
      store.dispatch(setAccessToken(accessToken));
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

export default baseQueryWithReAuth;
