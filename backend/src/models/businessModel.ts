import mongoose, { Schema, model } from "mongoose";

interface IBusiness {
  name: string;
  ownerName: string;
  phoneNumber: string;
  email: string;
  imgLink: string;
  locations: mongoose.Types.ObjectId[];
  userId: mongoose.Types.ObjectId;
}

const BusinessSchema = new Schema<IBusiness>({
  name: { type: String, required: true },
  ownerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  imgLink: {
    type: String,
    default: "https://www.w3schools.com/Tags/img_girl.jpg",
  },
  locations: [{ type: Schema.Types.ObjectId, ref: "Location" }],
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const Business = model<IBusiness>("Business", BusinessSchema);
