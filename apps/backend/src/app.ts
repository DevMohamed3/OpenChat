import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";

import { setupPassport } from "./config/passport.config.js";
import authRoutes from "./routes/auth.routes.js";

export const app = express(); 

app.use(express.json());
app.use(cors({ origin: "*" }));

// Required for passport
app.use(
  session({
    secret: "SECRET_SESSION",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

setupPassport();

app.use("/auth", authRoutes);

app.listen(4000, () => console.log("Server Running"));