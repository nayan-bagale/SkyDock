import { explorerProcess } from "@/redux/features/explorer/explorerSlice";
import { settingsProcess } from "@/redux/features/settings/settingsSlice";
import { terminalProcess } from "@/redux/features/terminal/terminalSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useCallback } from "react";

const useAppProcess = () => {
  const isSettingsOpen = useAppSelector(
    (state) => state.settings.actions.isProcessOn
  );
  const isTerminalOpen = useAppSelector(
    (state) => state.terminal.actions.isProcessOn
  );
  const isExplorerOpen = useAppSelector(
    (state) => state.explorer.actions.isProcessOn
  );

  const dispatch = useAppDispatch();

  const settingsApp = {
    open: useCallback(() => {
      dispatch(settingsProcess(true));
    }, []),

    close: useCallback(() => {
      dispatch(settingsProcess(false));
    }, []),
    isProcessOn: isSettingsOpen,
  };

  const terminalApp = {
    open: useCallback(() => {
      dispatch(terminalProcess(true));
    }, []),

    close: useCallback(() => {
      dispatch(terminalProcess(false));
    }, []),
    isProcessOn: isTerminalOpen,
  };

  const explorerApp = {
    open: useCallback(() => {
      dispatch(explorerProcess(true));
    }, []),
    close: useCallback(() => {
      dispatch(explorerProcess(false));
    }, []),
    isProcessOn: isExplorerOpen,
  };

  return {
    settingsApp,
    terminalApp,
    explorerApp,
  };
};

export default useAppProcess;
