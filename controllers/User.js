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
      res.status(409).json("User already exist on this email");
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
      res.status(201).json(newUser);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
