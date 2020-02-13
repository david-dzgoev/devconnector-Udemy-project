const jwt = require('jsonwebtoken');
const config = require('config');

// 'Next' is callback we call when done to move to the next piece of middleware
// Middleware is anything that has access to the request response cycle.
module.exports = function(req, res, next) {
  // Get token from header. When we send a request to a protected route, we need to send the token in the header
  // This is the header key that we want to send the token in. So this gets the token.
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Decode and verify token
  try {
    // Attempts to decrypt the token using jwtSecret to confirm it's what is expected.
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    // Take request object and assign user from payload. Then we can use that req.user in any of our protected routes
    // For instance we could get the user's id from this and then get their profile from that later
    //In other words this line sets the req.user to the user in the token.
    req.user = decoded.user;
    next();
  } catch (err) {
    // Will run if token is not valid
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
