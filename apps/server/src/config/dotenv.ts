import dotenv from "dotenv";
const env = process.env.NODE_ENV;
if (!env) {
  throw new Error("NODE_ENV is not defined");
}
dotenv.config({ path: `.env.${env}` });

export default dotenv;
