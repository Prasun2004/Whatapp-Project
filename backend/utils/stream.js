import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey=process.env.STREAM_API_KEY;
const apiSecrect=process.env.STREAM_API_SECRECT;

if (!apiKey || !apiSecrect) {
    console.log("apikey or apisecrect not present")
}

const streamClient=StreamChat.getInstance(apiKey,apiSecrect);

export const createStreamUser =async(userData)=>{
       console.log(userData);
    try {
        console.log(userData);
        await streamClient.upsertUser(userData);
        return userData;
    } catch (error) {
        console.log("error to create or update in stream",error);
    }
};

