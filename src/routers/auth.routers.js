import express from "express";
import { withAsync } from "../lib/withAsync.js";
import { register, login } from "../controllers/auth.controller.js";

const authRouter = express.Router;

authRouter.post("/register", withAsync(register));
authRouter.post("/login", withAsync(login));

export default authRouter;
