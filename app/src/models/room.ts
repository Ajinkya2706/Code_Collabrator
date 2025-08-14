import mongoose from "mongoose";

interface IRoom {
  roomId: string;
  name: string;
  createdBy: mongoose.Types.ObjectId;
  status: string;
  files: mongoose.Types.ObjectId[];
  messages?: mongoose.Types.ObjectId[];
}

// Function to generate ID in format xxx-xxx-xxx
function generateRoomId() {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  // Generate three groups of three characters
  for (let group = 0; group < 3; group++) {
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    // Add hyphen after first and second group
    if (group < 2) {
      result += "-";
    }
  }

  return result;
}

const RoomSchema = new mongoose.Schema<IRoom>(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      default: generateRoomId,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
    files: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "File",
      default: [],
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Room ||
  mongoose.model<IRoom>("Room", RoomSchema);
