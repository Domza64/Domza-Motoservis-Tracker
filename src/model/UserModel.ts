import mongoose from "mongoose";

export interface ServiceItem {
  title: string;
  lastService: number;
  lastServiceDate: Date;
  serviceInterval: number;
}

export interface IUserModel extends mongoose.Document {
  email: string;
  serviceItem: ServiceItem[];
  currentMilage: number;
}

const ServiceItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title."],
  },
  lastService: {
    type: Number,
    required: true,
  },
  lastServiceDate: {
    type: Date,
    required: true,
  },
  serviceInterval: {
    type: Number,
    required: true,
  },
});

const UserModelSchema = new mongoose.Schema<IUserModel>({
  email: {
    type: String,
    required: true,
    maxlength: [60, "Cannot be more than 60 characters"],
    unique: true,
    indexedDB: true,
  },
  serviceItem: {
    type: [ServiceItemSchema],
    required: [true, "Please provide a title."],
  },
  currentMilage: {
    type: Number,
    required: true,
    maxlength: [60, "Cannot be more than 60 characters"],
  },
});

export default mongoose.models.UserModel ||
  mongoose.model<IUserModel>("UserModel", UserModelSchema);
