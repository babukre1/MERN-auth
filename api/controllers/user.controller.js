import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
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
    const validPassword = bcryptjs.hashSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "wrong email or password"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.SECRET);
    const { password: hashedPassword, ...rest } = validUser._doc;
    const expiryDate = new Date(Date.now + 3600000);
    res
      .cookie("access_token", token, { httpOnly: true, expiresIn: expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
