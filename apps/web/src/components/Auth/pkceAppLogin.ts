import { PkceStatus } from "../hooks/useGetPkceParams";


export type PkceAppLogin =
  | { status: PkceStatus.Absent }
  | { status: PkceStatus.Invalid; message: string }
  | {
      status: PkceStatus.Ready;
      codeChallenge: string;
      redirectUri: string;
      state: string | null;
    };


export function buildPkceReturnUrl(
  redirectUri: string,
  code: string,
  state: string | null,
): string {
  const url = new URL(redirectUri);
  url.searchParams.set("code", code);
  if (state) url.searchParams.set("state", state);
  return url.toString();
}
