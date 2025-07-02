const express = require('express');
const router = express.Router();
const { 
  createBet, 
  getBet, 
  acceptBet, 
  getMyBets, 
  getAllBets,
  deleteBet,
  markBetAsWon,
  markBetAsLost,
  getLeaderboard
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
 * @route   GET /api/bets/leaderboard
 * @desc    Get leaderboard with user statistics
 * @access  Public
 */
router.get('/leaderboard', getLeaderboard);

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

/**
 * @route   DELETE /api/bets/:id
 * @desc    Delete a bet (only if not accepted)
 * @access  Private
 */
router.delete('/:id', protect, deleteBet);

/**
 * @route   POST /api/bets/:id/mark-won
 * @desc    Mark a bet as won (by creator)
 * @access  Private
 */
router.post('/:id/mark-won', protect, markBetAsWon);

/**
 * @route   POST /api/bets/:id/mark-lost
 * @desc    Mark a bet as lost (by creator)
 * @access  Private
 */
router.post('/:id/mark-lost', protect, markBetAsLost);

module.exports = router; 
