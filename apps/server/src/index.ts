import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { JwtPayload } from "jsonwebtoken";
import { corsOptions } from "./config/corsOptions";
import { OK } from "./constants/status";
import { middleware } from "./middleware";
import auth from "./routes/auth";
import files from "./routes/files-and-folders";
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

app.get("/api/v1/session", middleware, (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const decoded = decodeToken(refreshToken) as JwtPayload;
  res.status(OK).json({ user: decoded.user });
});

app.use("/api/v1/auth", auth);

app.get("/api/v1/protected", middleware, (req, res) => {
  res.status(OK).json({ message: "Access Granted." });
});

app.use("/api/v1", files);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
