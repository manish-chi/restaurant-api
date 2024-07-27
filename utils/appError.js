class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.error = error;
    this.statusCode = statusCode;
    this.status = statusCode.startsWith("4") ? "fail" : "success";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
