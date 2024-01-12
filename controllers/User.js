import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //getting existing user from db
    const existingUser = await UserModel.findOne({ email: email });

    //Checking the email exist in db and throwing error
    if (existingUser) {
      res
        .status(409)
        .json({ status: "failure", message: "Email alreday exist" });
    }

    //Creating new user
    if (name && email && password && !existingUser) {
      //Hasing password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new UserModel({
        name: name,
        email: email,
        password: hashedPassword,
      });
      await newUser.save();
      res.status(201).json({ status: "success", message: newUser });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await UserModel.findOne({ email: email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ status: "failure", message: "user not found " });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "failure", message: "incorrect password" });
    }

    if (existingUser.email === email && isMatch) {
      return res
        .status(200)
        .json({ status: "success", message: "user found successfully " });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
