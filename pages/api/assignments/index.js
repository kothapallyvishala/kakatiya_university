import { getSession } from "next-auth/react";
import Assignment from "../../../models/Assignment";
import { UserRole } from "../../../models/User";
import {
  errorHandler,
  responseHandler,
  validateAllOnce
} from "../../../utils/common";
import dbConnect from "../../../utils/mongo";

export default async function handler(req, res) {
  const { method } = req;
  const session = await getSession({ req });

  dbConnect();

  if (method === "POST") {
    try {
      if (
        session.user.role === UserRole.Admin ||
        (session.user.role === UserRole.Faculty &&
          session.user.isApprovedAsFaculty)
      ) {
        const { title, desc, sem, branch, subject } = req.body;
        validateAllOnce({
          title,
          desc,
          sem,
          branch,
          subject
        });

        const assignment = await Assignment.create(req.body);

        responseHandler(assignment, res);
      } else {
        errorHandler("Only faculty or admin can create assignments", res);
      }
    } catch (error) {
      errorHandler(error, res);
    }
  } else if (method === "GET") {
    try {
      const assignments = await Assignment.aggregate([
        { $match: {} },
        { $sort: { createdAt: -1 } }
      ]);
      responseHandler(assignments, res);
    } catch (error) {
      errorHandler(error, res);
    }
  } else {
    errorHandler("Invalid request type", res);
  }
}
