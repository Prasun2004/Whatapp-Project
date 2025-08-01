import express from "express";
import { login, logout, register } from "../controllers/authController.js";

const router=express.Router();

router.post("/signup", register);
router.route("/login").post(login);
router.route("/logout").get(logout);

export default router;