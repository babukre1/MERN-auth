import express, { json } from "express";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

const router = express.Router();

router.post("/", async (req, res, next) => {
  const { username, password, email } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, password: hashedPassword, email });
    
  try {
    await newUser.save();
    res.status(201).json({ message: "user craeted succesfully!" });
  } catch (error) {
    next(error)
  }
});
export default router;
