import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
});

const ClassSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 50,
    },
    video: videoSchema,
    year: {
      type: String,
      required: true,
      uppercase: true,
    },
    sem: {
      type: String,
      required: true,
      uppercase: true,
    },
    branch: {
      type: String,
      required: true,
      uppercase: true,
    },
    subject: {
      type: String,
      required: true,
      lowercase: true,
    },
    postedBy: {
      uid: {
        type: String,
        required: true,
        uppercase: true,
      },
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    watchedBy: {
      type: [
        {
          uid: { type: String },
          watchedPercent: { type: Number },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

mongoose.models = {};

export default mongoose.model("ClassLink", ClassSchema);
