import mongoose from "mongoose";

export interface IVisitorMessage {
  name: string;
  email: string;
  message: string;
}

const VisitorMessageSchema = new mongoose.Schema<IVisitorMessage>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

export default mongoose.models.VisitorMessage ||
  mongoose.model<IVisitorMessage>("VisitorMessage", VisitorMessageSchema); 