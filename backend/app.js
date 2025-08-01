import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoute.js"


dotenv.config({});

const app=express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin:true,
    credentials:true
}));

app.use("/auth",authRoutes);

const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("database connected");
    }catch(e){
        console.log(e);
    }
};

app.listen(8080,()=>{
    console.log("port listen");
    connectDB();
})