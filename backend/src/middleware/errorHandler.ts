import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  const status = typeof err.status === 'number' ? err.status : 500;
  const message = err.message ?? 'Internal Server Error';
  return res.status(status).json({
    success: false,
    error: {
      message,
      details: err.details ?? null
    }
  });
};
