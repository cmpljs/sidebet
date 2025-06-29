import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBets } from '../contexts/BetContext';

const useCountAnimation = (endValue, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (endValue !== count) {
      setIsAnimating(true);
      const startTime = Date.now();
      const startValue = count;
      const changeInValue = endValue - startValue;

      const animate = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (changeInValue * easeOutQuart);
        
        setCount(parseFloat(currentValue.toFixed(2)));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(endValue);
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [endValue, duration]);

  return { count, isAnimating };
};

const AnimatedValue = ({ value, className }) => {
  const { count } = useCountAnimation(value, 1500);
  
  return (
    <span className={className}>
      {value >= 0 ? '$' : '-$'}{Math.abs(count).toFixed(2)}
    </span>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const { getBetsByCreator, getBetsByAcceptor, markBetAsWon, markBetAsLost, loading } = useBets();
  const [updatingBet, setUpdatingBet] = useState(null);

  const createdBets = getBetsByCreator();
  const acceptedBets = getBetsByAcceptor();

  const calculateTotalOutcome = () => {
    const allBets = [...createdBets, ...acceptedBets];
    let totalWon = 0;
    let totalLost = 0;

    allBets.forEach(bet => {
      if (bet.status === 'won' || bet.status === 'lost') {
        const isCreator = bet.creator._id === user._id;
        const userStatus = getStatusFromUserPerspective(bet, isCreator);
        
        if (userStatus === 'won') {
          totalWon += bet.size;
        } else if (userStatus === 'lost') {
          totalLost += bet.size;
        }
      }
    });

    return {
      won: totalWon,
      lost: totalLost,
      net: totalWon - totalLost
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusFromUserPerspective = (bet, isCreator) => {
    if (bet.status === 'pending' || bet.status === 'accepted') {
      return bet.status;
    }
    
    if (bet.status === 'won' || bet.status === 'lost') {
      if (isCreator) {
        return bet.status;
      } else {
        return bet.status === 'won' ? 'lost' : 'won';
      }
    }
    
    return bet.status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900 text-yellow-200';
      case 'accepted':
        return 'bg-blue-500/10 text-green-200';
      case 'won':
        return 'bg-green-900 text-green-200';
      case 'lost':
        return 'bg-red-900 text-red-200';
      case 'completed':
        return 'bg-blue-900 text-blue-200';
      default:
        return 'bg-gray-900 text-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'won':
        return 'Won';
      case 'lost':
        return 'Lost';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const getMoneyColor = (status) => {
    switch (status) {
      case 'won':
        return 'text-green-400';
      case 'lost':
        return 'text-red-400';
      case 'pending':
      case 'accepted':
        return 'text-yellow-400';
      default:
        return 'text-green-400';
    }
  };

  const handleMarkAsWon = async (betId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setUpdatingBet(betId);
    try {
      await markBetAsWon(betId);
    } catch (error) {
      console.error('Error marking bet as won:', error);
    } finally {
      setUpdatingBet(null);
    }
  };

  const handleMarkAsLost = async (betId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setUpdatingBet(betId);
    try {
      await markBetAsLost(betId);
    } catch (error) {
      console.error('Error marking bet as lost:', error);
    } finally {
      setUpdatingBet(null);
    }
  };

  const BetCard = ({ bet, showCreator = false, index = 0, isNew = false }) => {
    const userStatus = getStatusFromUserPerspective(bet, showCreator);
    
    return (
      <div 
        className="card hover:bg-gray-750 transition-all duration-300 transform animate-slide-up relative"
        style={{
          animationDelay: `${index * 100}ms`,
          animationFillMode: 'both'
        }}
      >
        {isNew && (
          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
            NEW
          </div>
        )}
        <Link to={`/accept-bet/${bet._id}`} className="block">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-white">{bet.name}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(userStatus)}`}>
              {getStatusText(userStatus)}
            </span>
          </div>
          
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">{bet.description}</p>
          
          <div className="flex justify-between items-center">
            <div className={`font-bold ${getMoneyColor(userStatus)}`}>${bet.size}</div>
            <div className="text-gray-400 text-sm">{formatDate(bet.createdAt)}</div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-700">
            {bet.acceptedBy ? (
              <p className="text-gray-400 text-sm mb-1">
                <span className="text-blue-400">{bet.creator?.name || 'User'}</span>
                {' vs '}
                <span className="text-blue-400">{bet.acceptedBy?.name || 'User'}</span>
              </p>
            ) : (
              <p className="text-gray-400 text-sm mb-1">
                Created by: <span className="text-blue-400">{bet.creator?.name || 'User'}</span>
              </p>
            )}
          </div>
          
          <div className="mt-4">
            <span className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View Details →
            </span>
          </div>
        </Link>

        {showCreator && bet.acceptedBy && bet.status === 'accepted' && (
          <div className="mt-4 pt-4 border-t border-gray-700 flex space-x-2">
            <button
              onClick={(e) => handleMarkAsWon(bet._id, e)}
              disabled={updatingBet === bet._id}
              className="btn-success flex-1 text-sm py-2"
            >
              {updatingBet === bet._id ? 'Updating...' : 'Mark as Won'}
            </button>
            <button
              onClick={(e) => handleMarkAsLost(bet._id, e)}
              disabled={updatingBet === bet._id}
              className="btn-danger flex-1 text-sm py-2"
            >
              {updatingBet === bet._id ? 'Updating...' : 'Mark as Lost'}
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">Loading your bets...</div>
      </div>
    );
  }

  const allBets = [...createdBets, ...acceptedBets];
  const totalOutcome = calculateTotalOutcome();

  const sortedBets = [...allBets].sort((a, b) => {
    const getStatusPriority = (status) => {
      switch (status) {
        case 'pending':
        case 'accepted':
          return 1;
        case 'won':
        case 'lost':
          return 2;
        default:
          return 3;
      }
    };

    const aPriority = getStatusPriority(a.status);
    const bPriority = getStatusPriority(b.status);

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const newestBetId = sortedBets.length > 0 ? sortedBets[0]._id : null;

  const isBetNew = (bet) => {
    const now = new Date();
    const betDate = new Date(bet.createdAt);
    const timeDiff = now - betDate;
    const fiveMinutes = 5 * 60 * 1000;
    return timeDiff <= fiveMinutes;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Bets Dashboard</h1>
            <p className="text-gray-400">
              Welcome back, {user.name}! Manage your bets and track your challenges.
            </p>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 w-[180px] md:w-[220px]">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <h3 className="text-md font-medium text-gray-400 mb-2 md:mb-0">Total</h3>
              <AnimatedValue value={totalOutcome.net} className={`font-bold text-lg ${totalOutcome.net >= 0 ? 'text-green-400' : 'text-red-400'}`} />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <Link 
          to="/create-bet"
          className="btn-primary inline-flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Bet
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">All Your Bets</h2>
        {allBets.length === 0 ? (
          <div className="card text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No bets yet</h3>
            <p className="text-gray-400 mb-4">
              Create your first bet and challenge your friends!
            </p>
            <Link to="/create-bet" className="btn-primary">
              Create Your First Bet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedBets.map((bet, index) => {
              const isCreator = bet.creator && bet.creator._id === user._id;
              const isNew = isBetNew(bet);
              return (
                <BetCard 
                  key={bet._id} 
                  bet={bet} 
                  showCreator={isCreator} 
                  index={index} 
                  isNew={isNew} 
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 
