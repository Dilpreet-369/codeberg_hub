/**
 * Wraps an asynchronous express route handler to automatically catch errors
 * and forward them straight to the global error middleware.
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export default asyncHandler;