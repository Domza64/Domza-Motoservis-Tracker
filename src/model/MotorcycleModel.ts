import mongoose from "mongoose";

export interface ServiceItem {
  title: string;
  // Replace lastService with array of numbers where obviously last number will be last service
  lastService: number;
  lastServiceDate: Date;
  serviceInterval: number;
}

export interface IMotorcycleModel extends mongoose.Document {
  motorcycleName: string;
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

const MotorcycleModelSchema = new mongoose.Schema<IMotorcycleModel>({
  motorcycleName: {
    type: String,
    required: [true, "Please provide a model."],
    maxlength: [60, "Cannot be more than 60 characters"],
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

export default mongoose.models.MotorcycleModel ||
  mongoose.model<IMotorcycleModel>("MotorcycleModel", MotorcycleModelSchema);
