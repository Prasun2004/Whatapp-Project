import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({});

const app=express();

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