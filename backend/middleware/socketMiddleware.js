/**
 * Middleware to attach socket.io instance to request object
 * This allows controllers to emit real-time updates
 */
const socketMiddleware = (io) => {
  return (req, res, next) => {
    req.io = io;
    next();
  };
};

module.exports = socketMiddleware;
