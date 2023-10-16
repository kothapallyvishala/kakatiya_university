import User, { UserRole } from "../../../models/User";
import { errorHandler, responseHandler } from "../../../utils/common";
import dbConnect from "../../../utils/mongo";

export default async function handler(req, res) {
  const { method } = req;

  dbConnect();

  if (method === "GET") {
    try {
      const unapprovedFaculty = await User.find({
        isApprovedAsFaculty: false,
        role: UserRole.Faculty
      });

      responseHandler(unapprovedFaculty, res);
    } catch (error) {
      errorHandler(error, res);
    }
  } else {
    errorHandler("Invalid request type", res);
  }
}
