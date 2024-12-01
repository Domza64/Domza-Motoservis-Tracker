import mongoose from "mongoose";

export interface MotorcycleModel extends mongoose.Document {
  motorcycleName: string;
  imageUrl: string;
}

export interface IUserModel extends mongoose.Document {
  authId: string;
  bikes: MotorcycleModel[];
}

const MotorcycleSchema = new mongoose.Schema<MotorcycleModel>({
  motorcycleName: { type: String, required: true },
  imageUrl: { type: String, required: false },
});

const UserModelSchema = new mongoose.Schema<IUserModel>({
  authId: {
    type: String,
    required: true,
    unique: true,
    indexed: true,
  },
  bikes: {
    type: [MotorcycleSchema],
    default: [],
  },
});

export default mongoose.models.UserModel ||
  mongoose.model<IUserModel>("UserModel", UserModelSchema);
