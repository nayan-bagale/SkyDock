export enum ActionTypes {
  SET_EMAIL = "SET_EMAIL",
  SET_PASSWORD = "SET_PASSWORD",
  SET_CONFIRM_PASSWORD = "SET_CONFIRM_PASSWORD",
  SET_OTP = "SET_OTP",
  SET_EMAIL_ERROR = "SET_EMAIL_ERROR",
  SET_PASSWORD_ERROR = "SET_PASSWORD_ERROR",
  SET_CONFIRM_PASSWORD_ERROR = "SET_CONFIRM_PASSWORD_ERROR",
  SET_OTP_ERROR = "SET_OTP_ERROR",
  RESET_ERRORS = "RESET_ERRORS",
  RESET = "RESET",
}

export const initialState = {
  email: {
    value: "",
    error: "",
  },
  password: {
    value: "",
    error: "",
  },
  confirmPassword: {
    value: "",
    error: "",
  },
  otp: {
    value: "",
    error: "",
  },
};

export const forgotPasswordReducer = (
  state: typeof initialState,
  action: { type: ActionTypes; payload: string }
) => {
  switch (action.type) {
    case ActionTypes.SET_EMAIL:
      return {
        ...state,
        email: {
          ...state.email,
          value: action.payload,
        },
      };
    case ActionTypes.SET_PASSWORD:
      return {
        ...state,
        password: {
          ...state.password,
          value: action.payload,
        },
      };
    case ActionTypes.SET_CONFIRM_PASSWORD:
      return {
        ...state,
        confirmPassword: {
          ...state.confirmPassword,
          value: action.payload,
        },
      };
    case ActionTypes.SET_OTP:
      return {
        ...state,
        otp: {
          ...state.otp,
          value: action.payload,
        },
      };
    case ActionTypes.SET_EMAIL_ERROR:
      return {
        ...state,
        email: {
          ...state.email,
          error: action.payload,
        },
      };
    case ActionTypes.SET_PASSWORD_ERROR:
      return {
        ...state,
        password: {
          ...state.password,
          error: action.payload,
        },
      };
    case ActionTypes.SET_CONFIRM_PASSWORD_ERROR:
      return {
        ...state,
        confirmPassword: {
          ...state.confirmPassword,
          error: action.payload,
        },
      };
    case ActionTypes.SET_OTP_ERROR:
      return {
        ...state,
        otp: {
          ...state.otp,
          error: action.payload,
        },
      };
    case ActionTypes.RESET_ERRORS:
      return {
        ...state,
        email: {
          ...state.email,
          error: "",
        },
        password: {
          ...state.password,
          error: "",
        },
        confirmPassword: {
          ...state.confirmPassword,
          error: "",
        },
        otp: {
          ...state.otp,
          error: "",
        },
      };
    case ActionTypes.RESET:
      return initialState;
    default:
      return state;
  }
};
