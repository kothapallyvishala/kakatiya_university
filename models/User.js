import mongoose from "mongoose";

const allowedRoles = ["Student", "Faculty", "Admin"];

export const UserRole = Object.freeze({
  Student: "Student",
  Faculty: "Faculty",
  Admin: "Admin",
});

const UserSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
    },
    branch: {
      type: String,
      required: true,
      uppercase: true,
    },
    dateOfJoining: {
      type: String,
    },
    dateOfPassOut: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      validate: {
        validator: function (v) {
          return allowedRoles.includes(v);
        },
        message: (props) => `${props.value} is not a valid role`,
      },
      enum: allowedRoles,
      required: true,
    },
    name: {
      type: String,
      trim: true,
    },
    img: {
      type: String,
      trim: true,
    },
    desc: {
      type: String,
      max: 50,
    },
    dateOfBirth: {
      type: String,
    },
    isApprovedAsFaculty: {
      type: Boolean,
      required: function () {
        return this.role === UserRole.Faculty;
      },
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

mongoose.models = {};

export default mongoose.model("User", UserSchema);
