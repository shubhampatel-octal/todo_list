import mongoose, { Schema, model, Document } from "mongoose";

export interface ILocation extends Document {
  address: string;
  state: string;
  city: string;
  country: string;
  pincode: string;
  userId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const LocationSchema = new Schema<ILocation>(
  {
    address: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Location = model<ILocation>("Location", LocationSchema);

export default Location;
