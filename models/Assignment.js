import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true }
});

const imgSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true }
});

const SubmissionSchema = new mongoose.Schema(
  {
    uid: { type: String },
    img: imgSchema,
    pdf: pdfSchema,
    desc: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

const AssignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      max: 50
    },
    pdf: pdfSchema,
    img: imgSchema,
    sem: {
      type: String,
      required: true,
      uppercase: true
    },
    branch: {
      type: String,
      required: true,
      uppercase: true
    },
    subject: {
      type: String,
      required: true,
      lowercase: true
    },
    postedBy: {
      uid: {
        type: String,
        required: true,
        uppercase: true
      },
      name: { type: String, required: true },
      email: { type: String, required: true }
    },
    submissions: [SubmissionSchema]
  },
  {
    timestamps: true
  }
);

mongoose.models = {};

export const Submission = mongoose.model("Submission", SubmissionSchema);

export default mongoose.model("Assignment", AssignmentSchema);
