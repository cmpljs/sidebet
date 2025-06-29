const Bet = require('../models/Bet');

/**
 * @desc    Create a new bet
 * @route   POST /api/bets
 * @access  Private
 */
const createBet = async (req, res) => {
  try {
    const { name, description, size } = req.body;
    const creator = req.user._id;

    const bet = await Bet.create({
      name,
      description,
      size,
      creator
    });

    
    await bet.populate('creator', 'name email');

    res.status(201).json({
      success: true,
      message: 'Bet created successfully',
      data: {
        bet,
        shareableLink: `${req.protocol}://${req.get('host')}/accept-bet/${bet._id}`
      }
    });
  } catch (error) {
    console.error('Create bet error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating bet'
    });
  }
};

/**
 * @desc    Get a single bet by ID
 * @route   GET /api/bets/:id
 * @access  Public (for bet acceptance links)
 */
const getBet = async (req, res) => {
  try {
    const bet = await Bet.findById(req.params.id)
      .populate('creator', 'name email')
      .populate('acceptedBy', 'name email');

    if (!bet) {
      return res.status(404).json({
        success: false,
        message: 'Bet not found'
      });
    }

    res.json({
      success: true,
      data: {
        bet
      }
    });
  } catch (error) {
    console.error('Get bet error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bet'
    });
  }
};

/**
 * @desc    Accept a bet
 * @route   POST /api/bets/:id/accept
 * @access  Private
 */
const acceptBet = async (req, res) => {
  try {
    const bet = await Bet.findById(req.params.id);

    if (!bet) {
      return res.status(404).json({
        success: false,
        message: 'Bet not found'
      });
    }

    
    if (bet.acceptedBy) {
      return res.status(400).json({
        success: false,
        message: 'This bet has already been accepted'
      });
    }

    
    if (bet.creator.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot accept your own bet'
      });
    }

    
    bet.acceptedBy = req.user._id;
    bet.status = 'accepted';
    bet.acceptedAt = new Date();
    await bet.save();

    
    await bet.populate('creator', 'name email');
    await bet.populate('acceptedBy', 'name email');

    res.json({
      success: true,
      message: 'Bet accepted successfully',
      data: {
        bet
      }
    });
  } catch (error) {
    console.error('Accept bet error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while accepting bet'
    });
  }
};

/**
 * @desc    Get all bets for current user (created and accepted)
 * @route   GET /api/my-bets
 * @access  Private
 */
const getMyBets = async (req, res) => {
  try {
    const { type = 'all' } = req.query;
    let bets;

    switch (type) {
      case 'created':
        bets = await Bet.getCreatedBetsByUser(req.user._id);
        break;
      case 'accepted':
        bets = await Bet.getAcceptedBetsByUser(req.user._id);
        break;
      default:
        bets = await Bet.getBetsByUser(req.user._id);
    }

    res.json({
      success: true,
      data: {
        bets,
        count: bets.length
      }
    });
  } catch (error) {
    console.error('Get my bets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bets'
    });
  }
};

/**
 * @desc    Get all bets (for admin purposes)
 * @route   GET /api/bets
 * @access  Private
 */
const getAllBets = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }

    const bets = await Bet.find(query)
      .populate('creator', 'name email')
      .populate('acceptedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Bet.countDocuments(query);

    res.json({
      success: true,
      data: {
        bets,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Get all bets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bets'
    });
  }
};

/**
 * @desc    Delete a bet (only if not accepted)
 * @route   DELETE /api/bets/:id
 * @access  Private
 */
const deleteBet = async (req, res) => {
  try {
    const bet = await Bet.findById(req.params.id);

    if (!bet) {
      return res.status(404).json({
        success: false,
        message: 'Bet not found'
      });
    }

    
    if (bet.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own bets'
      });
    }

    
    if (bet.acceptedBy) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a bet that has already been accepted'
      });
    }

    await Bet.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Bet deleted successfully'
    });
  } catch (error) {
    console.error('Delete bet error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting bet'
    });
  }
};

/**
 * @desc    Mark a bet as won (by creator)
 * @route   POST /api/bets/:id/mark-won
 * @access  Private
 */
const markBetAsWon = async (req, res) => {
  try {
    const bet = await Bet.findById(req.params.id);

    if (!bet) {
      return res.status(404).json({
        success: false,
        message: 'Bet not found'
      });
    }

    
    if (bet.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the bet creator can mark the bet as won'
      });
    }

    
    if (!bet.acceptedBy) {
      return res.status(400).json({
        success: false,
        message: 'Cannot mark a bet as won before it is accepted'
      });
    }

    
    if (bet.status === 'won' || bet.status === 'lost') {
      return res.status(400).json({
        success: false,
        message: 'Bet has already been marked as won or lost'
      });
    }

    
    bet.status = 'won';
    bet.winner = bet.creator;
    bet.completedAt = new Date();
    await bet.save();

    
    await bet.populate('creator', 'name email');
    await bet.populate('acceptedBy', 'name email');
    await bet.populate('winner', 'name email');

    res.json({
      success: true,
      message: 'Bet marked as won successfully',
      data: {
        bet
      }
    });
  } catch (error) {
    console.error('Mark bet as won error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while marking bet as won'
    });
  }
};

/**
 * @desc    Mark a bet as lost (by creator)
 * @route   POST /api/bets/:id/mark-lost
 * @access  Private
 */
const markBetAsLost = async (req, res) => {
  try {
    const bet = await Bet.findById(req.params.id);

    if (!bet) {
      return res.status(404).json({
        success: false,
        message: 'Bet not found'
      });
    }

    
    if (bet.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the bet creator can mark the bet as lost'
      });
    }

    
    if (!bet.acceptedBy) {
      return res.status(400).json({
        success: false,
        message: 'Cannot mark a bet as lost before it is accepted'
      });
    }

    
    if (bet.status === 'won' || bet.status === 'lost') {
      return res.status(400).json({
        success: false,
        message: 'Bet has already been marked as won or lost'
      });
    }

    
    bet.status = 'lost';
    bet.winner = bet.acceptedBy;
    bet.completedAt = new Date();
    await bet.save();

    
    await bet.populate('creator', 'name email');
    await bet.populate('acceptedBy', 'name email');
    await bet.populate('winner', 'name email');

    res.json({
      success: true,
      message: 'Bet marked as lost successfully',
      data: {
        bet
      }
    });
  } catch (error) {
    console.error('Mark bet as lost error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while marking bet as lost'
    });
  }
};

module.exports = {
  createBet,
  getBet,
  acceptBet,
  getMyBets,
  getAllBets,
  deleteBet,
  markBetAsWon,
  markBetAsLost
}; 
