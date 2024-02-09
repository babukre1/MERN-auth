import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utiles/error.js";

export const test = () => {
  res.send("API Working");
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

// google auth controller.
export const google = async (req, res, next) => {
  const { name, email, photo } = req.body;
  const validUser = await User.findOne({ email });
  console.log(email);
  if (validUser) {
    console.log("user exists");
    const { password: memberPass, ...rest } = validUser._doc;
    const token = jwt.sign({ id: validUser._id }, process.env.SECRET);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);
    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: expiryDate,
      })
      .status(200)
      .json(rest);
  } else {
    const generatedPassword =
      Math.random().toString().slice(-8) + Math.random().toString().slice(-8);
    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
    const newUser = new User({
      username:
        name.split(" ").join("").toLowerCase() +
        Math.floor(Math.random() * 10000),
      email,
      password: hashedPassword,
      profilePicture: photo,
    });
    await newUser.save();
    const { password: memberPass, ...rest } = newUser._doc;
    const token = jwt.sign({ id: newUser._id }, process.env.SECRET);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);
    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: expiryDate,
      })
      .status(200)
      .json(rest);
  }
};

export const updateUser = async (req, res, next) => {
  let { username, email, profilePicture } = req.body;
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "you can update only your account"));
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updates = {
      username,
      email,
      password: req.body.password,
      profilePicture,
    };
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(
        ([key, value]) => value !== undefined && value !== ""
      )
    );
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: filteredUpdates,
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can delete only your account!'));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('User has been deleted...');
  } catch (error) {
    next(error);
  }

}


export const signout = (req, res) => {
  res.clearCookie('access_token').status(200).json("signout success");
}