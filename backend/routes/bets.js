const express = require('express');
const router = express.Router();
const { 
  createBet, 
  getBet, 
  acceptBet, 
  getMyBets, 
  getAllBets 
} = require('../controllers/betController');
const { protect, optionalAuth } = require('../middleware/auth');
const { createBetValidation } = require('../middleware/validation');

/**
 * @route   POST /api/bets
 * @desc    Create a new bet
 * @access  Private
 */
router.post('/', protect, createBetValidation, createBet);

/**
 * @route   GET /api/bets/my-bets
 * @desc    Get all bets for current user
 * @access  Private
 */
router.get('/my-bets', protect, getMyBets);

/**
 * @route   GET /api/bets
 * @desc    Get all bets (with pagination and filtering)
 * @access  Private
 */
router.get('/', protect, getAllBets);

/**
 * @route   GET /api/bets/:id
 * @desc    Get a single bet by ID
 * @access  Public (for bet acceptance links)
 */
router.get('/:id', optionalAuth, getBet);

/**
 * @route   POST /api/bets/:id/accept
 * @desc    Accept a bet
 * @access  Private
 */
router.post('/:id/accept', protect, acceptBet);

module.exports = router; 