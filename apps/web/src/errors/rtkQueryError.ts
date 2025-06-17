import type { Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import { showToast } from "@skydock/ui/toast";

enum ErrorStatus {
  FETCH_ERROR = "FETCH_ERROR",
  PARSING_ERROR = "PARSING_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  UNEXPECTED_ERROR = "UNEXPECTED_ERROR",
  HANDLED_ERROR = "HANDLED_ERROR",
}

export class ErrorHandler {
  private static toast = (message: string) => {
    return showToast(message, "error");
  };

  public static rtkQueryErrorMiddleware: Middleware =
    (api: MiddlewareAPI) => (next) => (action) => {
      if (isRejectedWithValue(action)) {
        console.error("RTK Query Error:", action);
        const status =
          action.payload &&
          typeof action.payload === "object" &&
          "status" in action.payload
            ? (action.payload as { status?: string }).status
            : undefined;

        if (status === ErrorStatus.FETCH_ERROR) {
          this.toast("Network error. Please check your connection.");
        } else if (status === ErrorStatus.PARSING_ERROR) {
          this.toast("Data parsing error. Please try again.");
        } else if (status === ErrorStatus.SERVER_ERROR) {
          this.toast("Server error. Please try again later.");
        } else {
          this.toast("An unexpected error occurred. Please try again.");
        }

        if (
          action.payload &&
          typeof action.payload === "object" &&
          "status" in action.payload
        ) {
          (action.payload as { status?: string }).status =
            ErrorStatus.HANDLED_ERROR;
        }
      }
      return next(action);
    };

  public static handleError(error: unknown, message: string): void {
    if (error instanceof Error) {
      this.toast(error.message);
    } else if (typeof error === "string") {
      this.toast(error);
    } else if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      (error as { status?: string }).status === ErrorStatus.HANDLED_ERROR
    ) {
      console.warn("Handled error:", message);
    } else {
      this.toast("An unexpected error occurred.");
    }
    console.error("Error:", error);
  }
}
