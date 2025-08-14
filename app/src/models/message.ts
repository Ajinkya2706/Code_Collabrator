import mongoose from "mongoose";

interface IMessage {
  roomId: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  message: string;
}

const MessageSchema = new mongoose.Schema<IMessage>(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Message ||
  mongoose.model<IMessage>("Message", MessageSchema);
