import mongoose from "mongoose";
export const Message = mongoose.model("Message", { body: String, image: String, from: String, timestamp:Number, roomName: String })
