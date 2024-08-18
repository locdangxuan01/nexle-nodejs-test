import express from "express";
import router from "./routes";
const app = express();

import "./dbs/init.mysql";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init routes
app.use("", router);

// handling error
app.use((_req, _res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, _req, res, _next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "Error",
    code: statusCode,
    message: error.message || "Internal server error",
  });
});

export default app;
