import httpStatus from 'http-status';

export const errorHandler = (err, _req, res, _next) => {
  const status = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const response = {
    message: err.message || 'Internal Server Error',
  };

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }

  res.status(status).json(response);
};
