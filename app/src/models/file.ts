import mongoose from "mongoose";

interface IFile {
  name: string;
  roomId: mongoose.Types.ObjectId;
  content: string;
  language: string;
  createdBy: mongoose.Types.ObjectId;
}

const FileSchema = new mongoose.Schema<IFile>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      enum: [
        // Folders
        "folder",
        
        // Web Development
        "javascript",
        "typescript",
        "jsx",
        "html",
        "css",
        "sass",
        "less",

        // Backend/Server-side
        "python",
        "java",
        "php",
        "ruby",
        "csharp",
        "go",
        "rust",
        "swift",
        "kotlin",
        "dart",

        // System Programming
        "c",
        "cpp",
        "assembly",

        // Functional Programming
        "haskell",
        "elixir",
        "clojure",
        "fsharp",
        "scala",

        // Data/Markup
        "markdown",
        "json",
        "xml",
        "yaml",
        "csv",
        "sql",
        "graphql",
        "toml",

        // Shell/Scripting
        "bash",
        "powershell",
        "batch",
        "perl",
        "lua",
        "r",

        // Configuration
        "dockerfile",
        "lock",
        "env",
        "ini",

        // Other
        "text",
        "unknown",
      ],
      default: "javascript",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.File ||
  mongoose.model<IFile>("File", FileSchema);
