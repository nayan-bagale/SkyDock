import { FC } from "react";
import { Button } from "@/ui/button";
import { UserInfo } from "@skydock/types/Auth";
import  PaperGlass  from "@skydock/ui/paper-glass";

interface AppRedirectProps {
  user: UserInfo | null;
  onLoginDifferent: () => void;
  onOpenInApp: () => void;
  onContinueOnWeb: () => void;
}

const AppRedirect: FC<AppRedirectProps> = ({
  user,
  onLoginDifferent,
  onOpenInApp,
  onContinueOnWeb,
}) => {
  return (
    <div className="relative ">
      <main
        className="relative z-10 w-full px-4 flex items-center justify-center min-h-screen"
        data-purpose="login-success-container"
      >
        <PaperGlass
          aria-labelledby="success-heading"
          className="w-full min-w-[420px] rounded-3xl p-8 sm:p-10 text-center text-white"
          data-purpose="status-card"
        >
          <div
            className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6 ring-4 ring-white/10 shadow-inner"
            data-purpose="success-icon-badge"
          >
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-white drop-shadow-sm"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              viewBox="0 0 24 24"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h1
            className="text-2xl font-bold text-white tracking-tight mb-2 drop-shadow-sm"
            id="success-heading"
          >
            Successfully Logged In!
          </h1>
          <p className="text-white/70 text-sm mb-6 font-normal leading-relaxed">
            Welcome back to your workspace
          </p>
          <div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/15 border border-white/15 mb-6 text-sm text-white/90 shadow-sm"
            data-purpose="active-user-display"
          >
            <span className="w-6 h-6 rounded-full bg-white text-purple-700 font-semibold text-xs flex items-center justify-center shadow-xs">
              {user?.name?.charAt(0) || user?.email?.charAt(0)}
            </span>
            <span className="font-medium tracking-wide">
              {" "}
              {user?.email || "Unknown"}
            </span>
            <span
              className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
              title="Active"
            ></span>
          </div>
          <Button
            className="w-full py-3 px-6 rounded-xl shadow-lg flex items-center justify-center mb-2"
            role="button"
            intent={"secondary"}
            size={"medium"}
            onClick={onOpenInApp}
          >
            <span className="">Open in App</span>
          </Button>
          <Button
            className="w-full py-3 px-6 rounded-xl shadow-lg mb-2 bg-white/15 border border-white/20 text-white font-medium text-sm hover:bg-white/20 flex items-center justify-center gap-2"
            role="button"
            intent={"primary"}
            size={"medium"}
            onClick={onContinueOnWeb}
          >
            <span className="">Continue on Web</span>
          </Button>
          <a
            href="#login-different"
            className=" text-xs font-medium text-white/70 hover:text-white transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/80 rounded-md py-1 px-2 inline-flex items-center justify-center gap-1.5 self-center"
            onClick={onLoginDifferent}
          >
            <span className="">Log in with a different account</span>
          </a>
        </PaperGlass>
      </main>
    </div>
  );
};

export default AppRedirect;
