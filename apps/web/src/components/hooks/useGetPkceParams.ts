import { useSearchParams } from "react-router";

const PKCE_PARAM_NAMES = ["code_challenge", "code_challenge_method", "redirect_uri"];

export function isSkydockRedirect(value: string): boolean {
  try {
    return new URL(value).protocol === "skydock:";
  } catch {
    return false;
  }
}

export enum PkceStatus {
  Absent = "absent",
  Invalid = "invalid",
  Ready = "ready",
}

export const useGetPkceParams = () => {
  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const hasPkceParam = PKCE_PARAM_NAMES.some((name) => params.has(name));
  if (!hasPkceParam) return { status: PkceStatus.Absent };

  const codeChallenge = params.get("code_challenge") ?? "";
  const method = params.get("code_challenge_method");
  const redirectUri = params.get("redirect_uri") ?? "";

  if (!codeChallenge || method !== "S256" || !isSkydockRedirect(redirectUri)) {
    return {
      status: PkceStatus.Invalid,
      message:
        "This app sign-in link is invalid. Use an S256 code challenge and a skydock:// redirect.",
    };
  }

  return {
    status: PkceStatus.Ready,
    codeChallenge,
    redirectUri,
    state: params.get("state"),
  };
};