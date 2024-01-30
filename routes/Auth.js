import express from "express";
import {
  ChangeUserPassword,
  Login,
  Register,
  loggedUser,
  resetUserPassword,
  sendUserPasswordResetEmail,
} from "../controllers/Auth.js";
import { checkUserAuth } from "../middlewares/auth-middleware.js";

const router = express.Router();

//routes midllewares
router.use("/changepassword", checkUserAuth);
router.use("/loggeduser", checkUserAuth);

//routes normal
router.post("/register", Register);
router.post("/login", Login);
router.post("/send_reset_password_email", sendUserPasswordResetEmail);
router.post("/reset_password/:id/:token", resetUserPassword)

//Protected Routes
router.post("/changepassword", ChangeUserPassword);
router.get("/loggeduser", loggedUser);

export default router;
