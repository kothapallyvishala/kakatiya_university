import bcrypt from "bcrypt";
import User from "../../../models/User";
import {
  errorHandler,
  responseHandler,
  validateAllOnce
} from "../../../utils/common";
import dbConnect from "../../../utils/mongo";

export default async function handler(req, res) {
  const { method } = req;

  dbConnect();

  if (method === "POST") {
    try {
      const { uid, branch, dateOfJoining, dateOfPassOut, email, password } =
        req.body;
      validateAllOnce({
        uid,
        branch,
        dateOfJoining,
        dateOfPassOut,
        email,
        password
      });

      // password = Test@11

      const hashPassword = await bcrypt.hash(req.body.password, 8);

      // hashPassword = kjdqskouqehjblh2o1eyt712tgkjqwbdo

      const user = await User.create({
        ...req.body,
        password: hashPassword
      });

      const userDoc = user._doc;
      delete userDoc.password;

      responseHandler(userDoc, res);
    } catch (error) {
      errorHandler(error, res);
    }
  } else {
    errorHandler("Invalid request type", res);
  }
}
