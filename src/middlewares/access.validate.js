require("dotenv").config();
import { AuthFailureError, BadRequestError } from "../core/error.response";
import jwt from "jsonwebtoken";

export const validatePayload = (req, _, next) => {
  const { email, password } = req.body;
  if (!email && !password) {
    next();
  }

  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regexEmail.test(String(email).toLowerCase())) {
    throw new BadRequestError("Invalid email!!!");
  }

  const validPassword = password.length >= 8 && password.length <= 20;
  if (!validPassword) {
    throw new BadRequestError("Invalid password!!!");
  }

  next();
};

export const validateHeader = (req, _, next) => {
  const HEADER = {
    AUTHORIZATION: "authorization",
  };
  console.log(req.headers[HEADER.AUTHORIZATION]);
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Invalid request access token");
  }
  try {
    const decodeUser = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY
    );

    if (!decodeUser && !decodeUser.id) {
      throw new AuthFailureError("Invalid request access token");
    }

    req.user = decodeUser;
    return next();
  } catch (error) {
    throw error;
  }
};
