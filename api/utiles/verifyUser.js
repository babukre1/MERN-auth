import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  console.log(token);
  if (!token) {
    return next(errorHandler(403, "you are not authenticated"));
  }
  jwt.verify(token, process.env.SECRET, (error, user) => {
    if (error) return next(errorHandler(403, "Token is not valid!"));
    req.user = user;
    console.log("this is user: ");
    console.log(user);
    next();
  });
};
