import  Jwt  from "jsonwebtoken";
import User from "./models/authModel.js";

export const protectRoute =async(req,res,next)=>{
    try {
        const token =req.cookies.Jwt;

        if (!token) {
            return res.status(401).json({
                success:false,
                message:"unauthorized access"
            })
        };

        const decode = Jwt.verify(token,process.env.JWT_SECRECT_KRY)

        if (!decode) {
            return res.status(401).json({
                success:false,
                message:"invaild token"
            })
        };

        const user =await User.findById(decode.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                success:false,
                message:"user not found on that token"
            })
        };

        req.user=user;
        next();
    } catch (error) {
        console.log(error);
    }
}