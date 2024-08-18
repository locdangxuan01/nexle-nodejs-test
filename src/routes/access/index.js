import express from "express";
import asyncHandler from "../../helpers/async.handler";
import accessController from "../../controllers/access.controller";
import {
  validateHeader,
  validatePayload,
} from "../../middlewares/access.validate";

const router = express.Router();

// sign up
router.post("/sign-up", validatePayload, asyncHandler(accessController.signup));
router.post("/sign-in", validatePayload, asyncHandler(accessController.signin));
router.post("/sign-out", validateHeader, asyncHandler(accessController.logout));
router.post(
  "/refresh-token",
  asyncHandler(accessController.handleRefreshToken)
);

export default router;
