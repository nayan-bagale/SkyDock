import {
  useLoginMutation,
  usePkceSessionMutation,
  useRefreshSessionMutation,
  useSendEmailVerificationMutation,
  useLazyGetUserInfoQuery,
} from "@/redux/apis/userAuthApi";
import { setAccessToken } from "@/redux/features/auth";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "@/ui/button";
import { AuthCard } from "@/ui/Cards/AuthFlow/AuthCard";
import { Form } from "@/ui/Cards/AuthFlow/Form";
import { Input, InputPassword } from "@/ui/input";
import { Icons } from "@skydock/ui/icons";
import { showToast } from "@skydock/ui/toast";
import { emailValidation, passwordValidation } from "@skydock/validation";
import { FC, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import useServerErrors from "../hooks/useServerErrors";
import ErrorMessage from "./ErrorMessage";
import InfoMessage from "./InfoMessage";
import { buildPkceReturnUrl } from "./pkceAppLogin";
import { PkceStatus, useGetPkceParams } from "../hooks/useGetPkceParams";
import AppRedirect from "./AppRedirect/AppRedirect";

interface SigninProps {}

const Signin: FC<SigninProps> = () => {
  const [formError, setFormError] = useState({
    email: "",
    password: "",
  });

  const [serverError, setServerError] = useServerErrors();
  const [emailVerification, setEmailVerification] = useState(false);
  const [email, setEmail] = useState("");
  const [useDifferentAccount, setUseDifferentAccount] = useState(false);

  const navigate = useNavigate();
  const pkce = useGetPkceParams();

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [pkceSession, { isLoading: isPkceSessionLoading }] =
    usePkceSessionMutation();
  const [refreshSession] = useRefreshSessionMutation();
  const [triggerUserInfo] = useLazyGetUserInfoQuery();
  const [sendEmailVerification, { isLoading: isSendEmailVerificationLoading }] =
    useSendEmailVerificationMutation();

  const isLoading =
    isLoginLoading || isSendEmailVerificationLoading || isPkceSessionLoading;
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (pkce.status !== PkceStatus.Ready || user) {
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        if (cancelled) return;
        const data = await refreshSession().unwrap();
        dispatch(setAccessToken(data.accessToken));
        await triggerUserInfo(undefined).unwrap();
      } catch {
        // No website session. The password form is the fallback.
      } finally {
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dispatch, pkce.status, refreshSession, triggerUserInfo, user]);

  const redirectToApp = async () => {
    if (pkce.status !== PkceStatus.Ready) return;
    if (!pkce.codeChallenge || !pkce.redirectUri) return;
    const { code } = await pkceSession({
      code_challenge: pkce.codeChallenge,
      code_challenge_method: "S256",
    }).unwrap();
    window.location.assign(
      buildPkceReturnUrl(pkce.redirectUri, code, pkce.state),
    );
  };

  const handleLoginWithGoogle = async () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  };

  const handleEmailVerification = async () => {
    try {
      await sendEmailVerification(email).unwrap();
      showToast("Verification email sent", "success");
    } catch (e: any) {
      showToast(e.data.message, "error");
    } finally {
      setEmailVerification(false);
      setServerError("");
    }
  };

  const handleContinue = async () => {
    setServerError("");
    try {
      await redirectToApp();
    } catch (e: any) {
      const message = e?.data?.message ?? "Could not continue to the app";
      showToast(message, "error");
      setServerError(message);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setServerError("");

    const emailResult = emailValidation(e.target[0].value);
    if (!emailResult.valid) {
      setFormError({ ...formError, email: emailResult.message });
      return;
    }
    setFormError({ ...formError, email: "" });

    const password = passwordValidation(e.target[1].value);
    if (!password.valid) {
      setFormError({ ...formError, password: password.message });
      return;
    }
    setFormError({ ...formError, password: "" });

    try {
      const data = await login({
        email: e.target[0].value,
        password: e.target[1].value,
      }).unwrap();
      dispatch(setAccessToken(data.accessToken));
      if (pkce.status === PkceStatus.Ready) {
        await redirectToApp();
        return;
      }
      e.target.reset();
    } catch (e: any) {
      if (e.data?.verifyEmail) {
        setEmailVerification(true);
      } else {
        const message = e.data?.message ?? "Could not sign in";
        showToast(message, "error");
        setServerError(message);
        setEmailVerification(false);
      }
    }
  };

  if (pkce.status === PkceStatus.Absent && user) {
    return <Navigate to="/" replace />;
  }

  if (pkce.status === PkceStatus.Invalid) {
    return (
      <AuthCard>
        <h1 className=" text-2xl font-bold text-white ">Login</h1>
        <ErrorMessage>{pkce.message}</ErrorMessage>
      </AuthCard>
    );
  }

  if (pkce.status === PkceStatus.Ready && user && !useDifferentAccount) {
    return (
      <AppRedirect
        user={user}
        onLoginDifferent={() => setUseDifferentAccount(true)}
        onOpenInApp={handleContinue}
        onContinueOnWeb={() => navigate("/")}
      />
    );
  }

  if (pkce.status === PkceStatus.Ready) {
    return (
      <AuthCard>
        <h1 className=" text-2xl font-bold text-white ">Login</h1>
        <span className=" animate-spin">
          <Icons.Loader className=" h-6 w-6" />
        </span>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <h1 className=" text-2xl font-bold text-white ">Login</h1>
      {serverError && <ErrorMessage>{serverError}</ErrorMessage>}
      {emailVerification && (
        <InfoMessage className=" inline-flex justify-between">
          {" "}
          Click to resend verification email
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleEmailVerification();
            }}
          >
            Resend
          </a>
        </InfoMessage>
      )}
      <Form onSubmit={handleSubmit}>
        <label className=" self-start" htmlFor="">
          Email
        </label>
        <Input
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          type="email"
        />
        {formError.email && <ErrorMessage>{formError.email}</ErrorMessage>}

        <label className=" self-start" htmlFor="">
          Password
        </label>
        <InputPassword placeholder="Password" />
        {formError.password && (
          <ErrorMessage>{formError.password}</ErrorMessage>
        )}
        <div className=" flex items-center justify-between w-full">
          <div>
            {/* <input id="remember-me" type="checkbox" />
                        <label htmlFor="remember-me"> Remember Me</label> */}
          </div>
          <Button
            className="hover:bg-transparent text-white"
            disabled={isLoading}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password
          </Button>
        </div>
        <Button
          size={"medium"}
          className=" w-full flex items-center justify-center my-2 "
          disabled={isLoading}
          intent={"secondary"}
          type="submit"
        >
          {isLoading ? (
            <span className=" animate-spin">
              <Icons.Loader className=" h-6 w-6" />{" "}
            </span>
          ) : (
            "Login"
          )}
        </Button>
        <div className=" flex items-center gap-2 w-full justify-center">
          <p>Don't have account? </p>
          <Button
            className=" hover:bg-transparent text-white "
            disabled={isLoading}
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </div>
        {pkce.status === PkceStatus.Absent && (
          <Button
            size={"medium"}
            onClick={handleLoginWithGoogle}
            className=" gap-4 bg-blue-500 text-white hover:bg-blue-600 w-full flex items-center justify-center my-2 "
            intent={"secondary"}
          >
            <Icons.Google_Logo_White className=" h-5 w-5" />
            <span> Sign in with Google</span>
          </Button>
        )}
      </Form>
    </AuthCard>
  );
};

export default Signin;
