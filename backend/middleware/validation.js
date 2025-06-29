const { validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  
  next();
};

/**
 * Validation rules for user registration
 */
const registerValidation = [
  require('express-validator').body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  require('express-validator').body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  require('express-validator').body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Name must be between 1 and 50 characters'),
  handleValidationErrors
];

/**
 * Validation rules for user login
 */
const loginValidation = [
  require('express-validator').body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  require('express-validator').body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

/**
 * Validation rules for bet creation
 */
const createBetValidation = [
  require('express-validator').body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Bet name must be between 1 and 100 characters'),
  require('express-validator').body('description')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Bet description must be between 1 and 500 characters'),
  require('express-validator').body('size')
    .isFloat({ min: 0.01 })
    .withMessage('Bet size must be a positive number'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  registerValidation,
  loginValidation,
  createBetValidation
}; 
