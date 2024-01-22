import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// User_Register
export const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //getting existing user from db
    const existingUser = await UserModel.findOne({ email: email });

    //Checking_the_email_exist_in_db_and_throwing_error
    if (existingUser) {
      res
        .status(409)
        .json({ status: "failure", message: "Email alreday exist" });
    }

    //Creating_new_user
    if (name && email && password && !existingUser) {
      //Hasing_password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new UserModel({
        name: name,
        email: email,
        password: hashedPassword,
      });
      await newUser.save();
      const saved_user = UserModel.findOne({ email: email });
      //Generating JWT
      const token = jwt.sign(
        { userId: saved_user._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );

      res
        .status(201)
        .json({ status: "success", message: newUser, token: token });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//User_Login
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
      //Generate JWT
      const token = jwt.sign(
        { userId: existingUser._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        status: "success",
        message: "user found successfully ",
        token: token,
      });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
