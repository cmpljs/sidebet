const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Bet name is required'],
    trim: true,
    maxlength: [100, 'Bet name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Bet description is required'],
    trim: true,
    maxlength: [500, 'Bet description cannot exceed 500 characters']
  },
  size: {
    type: Number,
    required: [true, 'Bet size is required'],
    min: [0.01, 'Bet size must be greater than 0']
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Bet creator is required']
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'won', 'lost', 'completed', 'cancelled'],
    default: 'pending'
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

/**
 * Index for better query performance
 */
betSchema.index({ creator: 1, createdAt: -1 });
betSchema.index({ acceptedBy: 1, createdAt: -1 });
betSchema.index({ status: 1 });

/**
 * Virtual for bet URL
 */
betSchema.virtual('acceptUrl').get(function() {
  return `/accept-bet/${this._id}`;
});

/**
 * Ensure virtual fields are serialized
 */
betSchema.set('toJSON', { virtuals: true });
betSchema.set('toObject', { virtuals: true });

/**
 * Static method to get bets by user (created or accepted)
 */
betSchema.statics.getBetsByUser = async function(userId) {
  return await this.find({
    $or: [
      { creator: userId },
      { acceptedBy: userId }
    ]
  }).populate('creator', 'name email')
    .populate('acceptedBy', 'name email')
    .sort({ createdAt: -1 });
};

/**
 * Static method to get created bets by user
 */
betSchema.statics.getCreatedBetsByUser = async function(userId) {
  return await this.find({ creator: userId })
    .populate('creator', 'name email')
    .populate('acceptedBy', 'name email')
    .sort({ createdAt: -1 });
};

/**
 * Static method to get accepted bets by user
 */
betSchema.statics.getAcceptedBetsByUser = async function(userId) {
  return await this.find({ acceptedBy: userId })
    .populate('creator', 'name email')
    .populate('acceptedBy', 'name email')
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model('Bet', betSchema); 