import mongoose from "mongoose";

export interface IUserModel extends mongoose.Document {
  email: string;
  bikes: Record<string, string>;
}

const UserModelSchema = new mongoose.Schema<IUserModel>({
  email: {
    type: String,
    required: true,
    maxlength: [60, "Cannot be more than 60 characters"],
    unique: true,
    indexedDB: true,
  },
  bikes: {
    type: Map,
    of: String,
    required: true,
    default: {},
  },
});

export default mongoose.models.UserModel ||
  mongoose.model<IUserModel>("UserModel", UserModelSchema);
