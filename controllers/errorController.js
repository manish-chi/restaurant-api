function sendErrorDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

function sendErrorProd(err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
}

function sendErrorDuplicates(err, res) {
  res.status(400).json({
    status: err.status,
    message: `${JSON.stringify(
      err.keyValue
    )} is found to be duplicate. Please provide another ${JSON.stringify(
      err.keyValue
    )}`,
  });
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status;

  if (process.env.NODE_ENV == "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV == "production") {
    if (err.code === 11000) {
      sendErrorDuplicates(err, res);
    } else {
      sendErrorProd(err, res);
    }
  }
  next();
};

export default errorHandler;