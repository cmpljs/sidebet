const User = require('../models/User');
const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');

/**
 * Middleware to protect routes requiring authentication
 */
const protect = async (req, res, next) => {
  try {
    let token;

    
    if (req.headers.authorization) {
      token = extractTokenFromHeader(req.headers.authorization);
    }

    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      
      const decoded = verifyToken(token);

      
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      
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

    
    if (req.headers.authorization) {
      token = extractTokenFromHeader(req.headers.authorization);
    }

    if (token) {
      try {
        
        const decoded = verifyToken(token);

        
        const user = await User.findById(decoded.id);
        if (user) {
          req.user = user;
        }
      } catch (error) {
        
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
