import { UserT } from ".";

declare global {
  namespace Express {
    interface Request {
      userInfo?: UserT["user"];
    }
  }
}
