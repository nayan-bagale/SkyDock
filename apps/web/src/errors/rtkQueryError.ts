import type { Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import { showToast } from "@skydock/ui/toast";

enum ErrorStatus {
  FETCH_ERROR = "FETCH_ERROR",
  PARSING_ERROR = "PARSING_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  UNEXPECTED_ERROR = "UNEXPECTED_ERROR",
  HANDLED_ERROR = "HANDLED_ERROR",
  UNHANDLED_ERROR = "UNHANDLED_ERROR",
  UNAUTHORIZED = 401,
}

export class RtkErrorHandler {
  protected static toast = (message: string) => {
    return showToast(message, "error");
  };

  public static rtkQueryErrorMiddleware: Middleware =
    (api: MiddlewareAPI) => (next) => (action) => {
      if (isRejectedWithValue(action)) {
        // console.error("RTK Query Error:", action);
        const status =
          action.payload &&
          typeof action.payload === "object" &&
          "status" in action.payload
            ? (action.payload as { status?: string }).status
            : undefined;

        if (status === ErrorStatus.FETCH_ERROR) {
          this.toast("Network error. Please check your connection.");
          (action.payload as { handled?: string }).handled =
            ErrorStatus.HANDLED_ERROR;
        } else if (status === ErrorStatus.PARSING_ERROR) {
          this.toast("Data parsing error. Please try again.");
          (action.payload as { handled?: string }).handled =
            ErrorStatus.HANDLED_ERROR;
        } else if (status === ErrorStatus.SERVER_ERROR) {
          this.toast("Server error. Please try again later.");
          (action.payload as { handled?: string }).handled =
            ErrorStatus.HANDLED_ERROR;
        } else if (Number(status) === ErrorStatus.UNAUTHORIZED) {
          console.warn("Unauthorized access attempt detected.");
          (action.payload as { handled?: string }).handled =
            ErrorStatus.HANDLED_ERROR;
        }
      }

      return next(action);
    };
}

export class ErrorHandler extends RtkErrorHandler {
  private hasDisplayed = false;

  constructor(error: unknown) {
    super();
    this.handleError(error);
  }

  public handleError(error: unknown): ErrorHandler {
    console.log(error);
    if (
      typeof error === "object" &&
      error !== null &&
      "handled" in error &&
      (error as { handled?: string }).handled === ErrorStatus.HANDLED_ERROR
    ) {
      this.hasDisplayed = true;
    } else if (error instanceof Error) {
      this.internalDisplay(error.message);
      this.hasDisplayed = true;
    }
    return this;
  }

  private internalDisplay(message: string): void {
    this.hasDisplayed = true;
    ErrorHandler.toast(message);
  }

  public display(message: string): this {
    if (!this.hasDisplayed) {
      this.hasDisplayed = true;
      ErrorHandler.toast(message);
    }
    return this;
  }
}

export const HandleError = (error: unknown) => {
  return new ErrorHandler(error);
};
