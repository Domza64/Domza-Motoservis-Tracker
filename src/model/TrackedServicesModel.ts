import mongoose from "mongoose";

interface DateTrackedMilage {
  date: Date;
  milage: number;
}

export interface ServiceTime {
  serviceDate: Date;
  servicedAt: number; // km
}

export interface ServiceItem {
  title: string;
  services: ServiceTime[];
  serviceInterval: number;
  serviceIntervalDays: number;
}

export interface ITrackedServicesModel extends mongoose.Document {
  serviceItem: ServiceItem[];
  ownerId: string;
  milage: DateTrackedMilage[];
  motorcycleName: string;
}

const ServiceItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title."],
  },
  services: [
    {
      serviceDate: {
        type: Date,
        required: true,
      },
      servicedAt: {
        type: Number,
        required: true,
      },
    },
  ],
  serviceInterval: {
    type: Number,
    required: true,
  },
  serviceIntervalDays: {
    type: Number,
    required: true,
  },
});

const TrackedServicesSchema = new mongoose.Schema<ITrackedServicesModel>({
  serviceItem: {
    type: [ServiceItemSchema],
    required: [true, "Please provide service items."],
  },
  milage: [
    {
      date: { type: Date, required: true },
      milage: { type: Number, required: true },
    },
  ],
  ownerId: {
    type: String,
    required: true,
    index: true,
  },
  motorcycleName: {
    type: String,
    required: true,
  },
});

export default mongoose.models.TrackedServicesModel ||
  mongoose.model<ITrackedServicesModel>(
    "TrackedServicesModel",
    TrackedServicesSchema
  );
