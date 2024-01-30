import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

export const checkUserAuth = async (req, res, next) => {
  try {
    let token;
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer")) {
      token = authorization.split(" ")[1];

      //verifyToken
      const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);

      //getUserFromToken
      req.user = await UserModel.findById(userId).select("-password");
      next();
    }

    if (!token) {
      res.status(401).json("no token in user");
    }
  } catch (error) {
    res.status(401).json("something went wrong");
  }
};
