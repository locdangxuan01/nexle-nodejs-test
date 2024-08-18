import express from "express";
import accessRouter from "./access";
const router = express.Router();

// sign up
router.use("/v1/api", accessRouter);

export default router;
