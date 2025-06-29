const User = require('../models/User');
const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');

/**
 * Middleware to protect routes requiring authentication
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (req.headers.authorization) {
      token = extractTokenFromHeader(req.headers.authorization);
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = verifyToken(token);

      // Get user from token
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Optional auth middleware - doesn't fail if no token provided
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (req.headers.authorization) {
      token = extractTokenFromHeader(req.headers.authorization);
    }

    if (token) {
      try {
        // Verify token
        const decoded = verifyToken(token);

        // Get user from token
        const user = await User.findById(decoded.id);
        if (user) {
          req.user = user;
        }
      } catch (error) {
        // Token is invalid, but we don't fail the request
        console.log('Invalid token in optional auth:', error.message);
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};

module.exports = {
  protect,
  optionalAuth
}; 