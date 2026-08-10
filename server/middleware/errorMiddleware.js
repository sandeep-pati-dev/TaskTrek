/**
 * Centralized Express Error Handling Middleware.
 * Standardizes API error responses and masks internal details/stack traces.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || "An unexpected server error occurred";
  let errors = err.errors || undefined;

  // Handle specific database/Mongoose exceptions
  if (err.name === "CastError") {
    // e.g., Invalid MongoDB ObjectId format
    statusCode = 404;
    message = "Resource not found (invalid identifier)";
  } else if (err.name === "ValidationError") {
    // Mongoose schema validation failures
    statusCode = 400;
    message = "Database validation failed";
    errors = Object.keys(err.errors).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});
  } else if (err.code === 11000) {
    // MongoDB duplicate key error
    statusCode = 409;
    message = "Duplicate field value entered";
  }

  // Determine env environment
  const isDev = process.env.NODE_ENV === "development";

  // Build uniform payload
  const errorResponse = {
    message,
    ...(errors && { errors }),
    ...(isDev && { stack: err.stack }), // Only expose stack traces in local development
  };

  // Log error locally for debugging (avoiding console.log if production/testing is sensitive, but standard console.error is helpful)
  console.error(`[ERROR] ${req.method} ${req.url} - Status ${statusCode}:`, err);

  res.status(statusCode).json(errorResponse);
};

export default errorHandler;
