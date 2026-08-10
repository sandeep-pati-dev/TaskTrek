import express from "express";
import { signUpUser, loginUser } from "../controllers/userController.js";
import {
  validateSchema,
  signupSchema,
  loginSchema,
} from "../middleware/validationMiddleware.js";
import { authRateLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

router.post("/signup", authRateLimiter, validateSchema(signupSchema), signUpUser);

router.post("/login", authRateLimiter, validateSchema(loginSchema), loginUser);

export default router;
