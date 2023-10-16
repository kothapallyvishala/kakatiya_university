import ClassLink from "../../../../models/ClassLink";
import { errorHandler, responseHandler } from "../../../../utils/common";
import dbConnect from "../../../../utils/mongo";

export default async function handler(req, res) {
  const {
    method,
    query: { id }
  } = req;

  dbConnect();

  if (method === "GET") {
    try {
      const classLink = await ClassLink.aggregate([
        { $match: { "postedBy.uid": id } }
      ]);
      responseHandler(classLink, res);
    } catch (error) {
      errorHandler(error, res);
    }
  } else {
    errorHandler("Invalid request type", res);
  }
}
