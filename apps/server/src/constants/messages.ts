const messages = {
  REFRESH_TOKEN_EXPIRED: "Refresh token expired",
  INVALID_REFRESH_TOKEN: "Invalid token",

  ACCESS_TOKEN_EXPIRED: "Access token expired",
  ACCESS_TOKEN_NOT_FOUND: "Access Token Not Found",
  INVALID_ACCESS_TOKEN: "Invalid token",

  UNAUTHORIED: "Unauthorized",

  INVALID_CREDENTIALS: "Invalid credentials",
  INTERNAL_SERVER_ERROR: "Internal server error",

  USER_CREATED: "User created",

  LOGOUT: "Logged out",
} as const;

export default messages;
