import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { JwtPayload } from "jsonwebtoken";
import { corsOptions } from "./config/corsOptions";
import "./config/dotenv";
import { OK } from "./constants/status";
import authMiddleware from "./middleware/auth-middleware";
import authRoute from "./routes/auth-route";
import filesRoute from "./routes/files-route";
import { decodeToken } from "./utils/token";

const app = express();
// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

app.get("/api/v1/session", authMiddleware, (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const decoded = decodeToken(refreshToken) as JwtPayload;
  res.status(OK).json({ user: decoded.user });
});

// app.get("/api/v1", rateLimitMiddleware.loginLimiter, (req, res) => {
//   res.status(OK).json({ message: "Welcome to the API!" });
// });

app.use("/api/v1/auth", authRoute);

app.get("/api/v1/protected", authMiddleware, (req, res) => {
  res.status(OK).json({ message: "Access Granted." });
});

app.use("/api/v1", filesRoute);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
