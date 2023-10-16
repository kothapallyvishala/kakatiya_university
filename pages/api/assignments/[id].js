import { getSession } from "next-auth/react";
import Assignment from "../../../models/Assignment";
import { errorHandler, responseHandler } from "../../../utils/common";
import dbConnect from "../../../utils/mongo";

export default async function handler(req, res) {
  const {
    method,
    query: { id, submission }
  } = req;
  const session = await getSession({ req });

  dbConnect();

  if (method === "GET") {
    try {
      let assignment;
      if (req.query.submission) {
        assignment = await Assignment.findOne(
          { _id: id },
          { submissions: { $elemMatch: { _id: submission } } }
        );

        assignment = { ...assignment._doc, isSubmission: true };
      } else {
        assignment = await Assignment.findById(id);
        assignment = { ...assignment._doc, isSubmission: false };
      }

      console.log(assignment);
      responseHandler(assignment, res);
    } catch (error) {
      errorHandler(error, res);
    }
  } else if (method === "DELETE") {
    try {
      if (session.user.uid === req.body.uid) {
        await Assignment.findByIdAndDelete(id);
        responseHandler("Assignment Deleted", res);
      } else {
        errorHandler("You can only delete assignment posted by you", res);
      }
    } catch (error) {
      errorHandler(error, res);
    }
  } else if (method === "PUT") {
    console.log("Hellooooo");
    try {
      if (req.body.submissionData) {
        const submission = await Assignment.findByIdAndUpdate(req.body.id, {
          $push: {
            submissions: req.body.submissionData
          }
        });

        responseHandler(submission, res);
      } else if (req.body.submitId) {
        const assignment = await Assignment.updateOne(
          {
            _id: req.body.id,
            "submissions._id": req.body.submitId
          },
          {
            $set: {
              "submissions.$.pdf": req.body.pdf,
              "submissions.$.img": req.body.img,
              "submissions.$.desc": req.body.desc
            }
          }
        );

        console.log("assignment >>>> ", assignment);
        responseHandler(assignment, res);
      } else {
        await Assignment.findByIdAndUpdate(req.body.id, req.body);
        responseHandler("Assignment Updated", res);
      }
    } catch (error) {
      errorHandler(error, res);
    }
  } else {
    errorHandler("Invalid request type", res);
  }
}
