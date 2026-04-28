import { Schema, model, models } from "mongoose";

const patientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    condition: {
      type: String,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

patientSchema.index({ doctorId: 1 });
patientSchema.index({ name: 1 });

export const Patient = models.Patient || model("Patient", patientSchema);