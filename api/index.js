import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import membersRoutes from "./routes/member.route.js";
import adminRoutes from "./routes/admin.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(cookieParser());
dotenv.config();
app.use(cors());
app.use(cors({ origin: "/api", credentials: true }));

mongoose
  .connect(process.env.MONGO)
  .then((res) => {
    console.log("connected to mongoDB");
  })
  .catch((err) => console.log("didnt connected: ", err));
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/members", membersRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
  const statusCode = res.statusCode || 500;
  const message = err.message || "Internal Error Message";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

app.listen(3004, () => {
  console.log("server listening in port 3000");
});
