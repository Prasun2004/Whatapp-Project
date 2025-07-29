import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";


dotenv.config({});

const app=express();

app.use(cors({
    origin:true,
    credentials:true
}));

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