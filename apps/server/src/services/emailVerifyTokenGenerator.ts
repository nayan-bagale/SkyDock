import { LoginResponse } from "@skydock/types/Auth";
import { createEmailVerificationToken } from "../utils/token";

export const emailVerifyUrlGenerator = (user: LoginResponse) => {
  const baseUrl = process.env.SERVER_URL || "http://localhost:3000";
  const token = createEmailVerificationToken(user);
  const url = `${baseUrl}/api/v1/auth/verify-email?token=${token}`;
  return url;
};
