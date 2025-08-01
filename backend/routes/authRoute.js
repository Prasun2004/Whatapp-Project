import express from "express";
import { login, logout, onboarding, register } from "../controllers/authController.js";
import { protectRoute } from "../middleWare.js";

const router=express.Router();

router.post("/signup", register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.post("/onboarding",protectRoute,onboarding)

router.get("/me",protectRoute,(req,res)=>{
    res.status(200).json({success:true,user:req.user});
});

export default router;