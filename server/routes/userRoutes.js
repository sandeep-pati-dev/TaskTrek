import express from "express";
import { signUpUser, loginUser } from "../controllers/userController.js";
import {
  validateSchema,
  signupSchema,
  loginSchema,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/signup", validateSchema(signupSchema), signUpUser);

router.post("/login", validateSchema(loginSchema), loginUser);

export default router;
