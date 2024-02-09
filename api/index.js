import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

const app = express();
app.use(cookieParser());
dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then((res) => {
    console.log("connected to mongoDB");
  })
  .catch((err) => console.log("didnt connected: ", err));
const __dirname = path.resolve()
app.use(express.json());
app.use(express.static(path.join(__dirname, '/client/dist')));
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.get("*", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

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
