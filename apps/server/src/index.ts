import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { corsOptions } from "./config/corsOptions";
import { middleware } from "./middleware";
import auth from "./routes/auth";

const app = express();
// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/auth", auth);

app.get("/protected", middleware, (req, res) => {
  res.send("Protected route");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
