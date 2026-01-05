import { HttpError } from "../error/errors.js";
import { ZodError } from "zod";

const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: err.errors?.[0]?.message || "잘못된 요청입니다.",
    });
  }

  if (err instanceof HttpError) {
    const status = err.statusCode || err.status;
    return res.status(status).json({
      status: status,
      message: err.message,
    });
  }
  const status = 500;
  const message = "서버 내부 오류 발생.";
  return res.status(status).json({
    status: status,
    message: message,
  });
};

export default errorHandler;
