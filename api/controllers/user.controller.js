import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utiles/error.js";
export const test = (req, res) => {
  res.json({
    messsage: "API Working!",
  });
};

// signup controller.
export const signup = async (req, res, next) => {
  const { username, password, email } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, password: hashedPassword, email });

  try {
    await newUser.save();
    res.status(201).json({ message: "user craeted succesfully!" });
  } catch (error) {
    next(error);
  }
};

// login contrller.
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(401, "user not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    console.log(validPassword);
    if (!validPassword) {
      return next(errorHandler(401, "wrong email or password"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.SECRET);
    const { password: hashedPassword, ...rest } = validUser._doc;
    const expiryDate = new Date(); // Create a new date object
    expiryDate.setHours(expiryDate.getHours() + 1); // Set expiration to 1 hour from now
    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: expiryDate, // Set the expiration date
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
