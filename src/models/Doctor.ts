import { Schema, model, models } from "mongoose";

const doctorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    hospital: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

doctorSchema.index({ name: 1 });
doctorSchema.index({ specialization: 1 });

export const Doctor = models.Doctor || model("Doctor", doctorSchema);
