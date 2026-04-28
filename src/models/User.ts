import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "doctor", "staff"],
      default: "admin",
    },
  },
  {
    timestamps: true,
  },
);

export const User = models.User || model("User", userSchema);
