import { getSession } from "next-auth/react";
import ClassLink from "../../../models/ClassLink";
import { errorHandler, responseHandler } from "../../../utils/common";
import dbConnect from "../../../utils/mongo";

export default async function handler(req, res) {
  const {
    method,
    query: { id }
  } = req;
  const session = await getSession({ req });

  dbConnect();

  if (method === "GET") {
    try {
      const classLink = await ClassLink.findById(id);
      responseHandler(classLink, res);
    } catch (error) {
      errorHandler(error, res);
    }
  } else if (method === "DELETE") {
    try {
      if (session.user.uid === req.body.uid) {
        await ClassLink.findByIdAndDelete(id);
        responseHandler("Class Link Deleted", res);
      } else {
        errorHandler("You can only delete a class link posted by you", res);
      }
    } catch (error) {
      errorHandler(error, res);
    }
  } else if (method === "PUT") {
    try {
      if (req.body.percent) {
        await ClassLink.findByIdAndUpdate(
          id,
          { $pull: { watchedBy: { uid: req.body.uid } } },
          {
            new: true
          }
        );

        await ClassLink.findByIdAndUpdate(
          id,
          {
            $addToSet: {
              watchedBy: {
                uid: req.body.uid,
                watchedPercent: req.body.percent
              }
            }
          },
          {
            new: true
          }
        );
      } else if (session.user.uid === req.body.uid) {
        await ClassLink.findByIdAndUpdate(req.body);
      }
      responseHandler("Class Link Updated", res);
    } catch (error) {
      errorHandler(error, res);
    }
  } else {
    errorHandler("Invalid request type", res);
  }
}
