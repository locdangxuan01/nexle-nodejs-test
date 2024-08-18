import ReasonPhrases from "../utils/reasonPhrases";
import StatusCodes from "../utils/statusCodes";

// const ReasonStatusCode = {
//   FORBIDDEN: "Bad request error",
//   CONFLICT: "Conflict error",
// };

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.CONFLICT,
    statusCode = StatusCodes.CONFLICT
  ) {
    super(message, statusCode);
  }
}

export class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.BAD_GATEWAY,
    statusCode = StatusCodes.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}

export class AuthFailureError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    statusCode = StatusCodes.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

export class ForbiddenError extends ErrorResponse {
  constructor(message, status) {
    super(message, status);
  }
}

export class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.NOT_FOUND,
    statusCode = StatusCodes.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}
