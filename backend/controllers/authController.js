import  Jwt  from "jsonwebtoken";
import User from "../models/authModel.js";
import bcrypt from "bcryptjs";
import { createStreamUser } from "../utils/stream.js";


export const register =async (req,res)=>{
    
    try {
        const {name,email,password}=req.body;
       
       
        if (!name || !email || !password) {
            return res.status(400).json({
                success:false,
                message:"please enter all details"
            })
        }
            const user=await User.findOne({email});
           
            if (user) {
                return res.status(400).json({
                    success:false,
                    message:"user exist already"
                })
            }
            const hashpassword=await bcrypt.hash(password,5);
            const idx=Math.floor(Math.random()*100)+1;
            const randomAvatar=`https://avatar.iran.liara.run/public/${idx}.png`;

            const userInfo = await User.create({
                name,
                email,
                password:hashpassword,
                profilepic:randomAvatar
            });
            
            try {
                await createStreamUser({
                id:userInfo._id,
                name:userInfo.name,
                image:userInfo.profilepic || ""
            })
            console.log(`stram user create ${userInfo.name}`);
            } catch (error) {
                console.log("some error in stream when registration done")
            }
         
           
            const  token =Jwt.sign({userId:userInfo._id},process.env.JWT_SECRECT_KRY,{
                expiresIn:"7d"
            })

            res.cookie("jwt",token,{
                maxAge:7*24*60*60*1000,
                httpOnly:true, // prevent XSS attacks
                sameSite:"strict"  // prevent CSRF attacks
            })
           return res.status(201).json({
                 userInfo,
                success:true,
                message:"registration successfully completed"
            })
          
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"failed  to registration"
        })
    }
}

export const login =async(req,res)=>{
    try {
        const {email,password}=req.body;
        if ( !email || !password) {
            return res.status(400).json({
                success:false,
                message:"please enter all details"
            })
        }
            const user=await User.findOne({email});
            if (!user) {
                return res.status(400).json({
                    success:false,
                    message:"user doesnot exist"
                })
            }
             const isPassword=await bcrypt.compare(password,user.password);
             if (!isPassword) {
                return res.status(400).json({
                    success:false,
                    message:"incorrect password"
                })
            }

            const  token =Jwt.sign({userId:user._id},process.env.JWT_SECRECT_KRY,{
                expiresIn:"7d"
            })

            res.cookie("jwt",token,{
                maxAge:7*24*60*60*1000,
                httpOnly:true, // prevent XSS attacks
                sameSite:"strict"  // prevent CSRF attacks
            })

            return res.status(200).json({
                success:true,
                user,
                message:"login successfully"
            })
            //generateToken(res,user,`welcome back ${user.name}`);  
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"failed  to login"
        })
    }
}

export const logout =async(req,res)=>{
    try {
        res.clearCookie("jwt") // as token name previously jwt
        return res.status(200).json({
            success:"true",
            message:"logout successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"failed  to logout"
        })
    }
}