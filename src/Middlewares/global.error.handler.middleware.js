import envConfig from "../config/env.config.js";

// Global error handling middleware
/** 
* @param {Error} err - The error object 
* @param {Request} req -  request object
* @param {Response} res -  response object
* @param {Function} next - The next middleware function
*/

const globalErrorHandler = (err, req, res, next) => {
  res.status(err?.statusCode || 500).json({
    message: err.message || "Internal server error",
    stack: envConfig.app.NODE_ENV === "dev" ? err.stack : undefined,
    error: {
      code: err.code,
      details: err.details,
    },
  });
};

export default globalErrorHandler;
