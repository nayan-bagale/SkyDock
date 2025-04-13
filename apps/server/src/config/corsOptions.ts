import { CorsOptions } from "cors";

export const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:3500",
  "http://localhost:5173",
  "http://localhost:4173",
  "https://skydock.nayanbagale.me",
];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin ?? "") !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  // optionsSuccessStatus: 200,
  // preflightContinue: true,
  credentials: true,
  // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  // allowedHeaders: ["Content-Type", "Authorization"],
};
