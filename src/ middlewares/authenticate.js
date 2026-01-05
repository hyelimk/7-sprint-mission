function authenticate(options = { optional: false }) {
  return async (req, res, next) => {
    next();
  };
}
