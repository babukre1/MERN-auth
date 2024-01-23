import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

const app = express();

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then((res) => {
    console.log("connected to mongoDB");
  })
  .catch((err) => console.log("didnt connected: ", err));
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

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

