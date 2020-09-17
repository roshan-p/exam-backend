import mongoose from "mongoose";
export const Room = mongoose.model("Room", { roomName: String, messages: Array })
