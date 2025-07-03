import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

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

const Leaderboards = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const jwt = localStorage.getItem('sidebet_jwt');
      const response = await api.get('/bets/leaderboard', { token: jwt });
      setLeaderboard(response.data.leaderboard);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <div className="flex items-center justify-center w-8 h-8 bg-yellow-500 text-yellow-900 font-bold rounded-full">
          🥇
        </div>
      );
    } else if (rank === 2) {
      return (
        <div className="flex items-center justify-center w-8 h-8 bg-gray-400 text-gray-900 font-bold rounded-full">
          🥈
        </div>
      );
    } else if (rank === 3) {
      return (
        <div className="flex items-center justify-center w-8 h-8 bg-amber-600 text-amber-100 font-bold rounded-full">
          🥉
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center w-8 h-8 bg-gray-700 text-gray-300 font-bold rounded-full">
          {rank}
        </div>
      );
    }
  };

  const getNetWinningsColor = (netWinnings) => {
    if (netWinnings > 0) {
      return 'text-green-400';
    } else if (netWinnings < 0) {
      return 'text-red-400';
    } else {
      return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={fetchLeaderboard}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white p-6 leaderboards-page">
      <div className="max-w-6xl mx-auto scrollbar-hide">
        {/* Header */}
        <div className="text-left mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-4xl font-bold text-white mb-4">
            Leaderboards
          </h1>
          <p className="text-gray-400 text-lg">
            See who's winning the most bets and climbing the ranks
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card rounded-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white">Total Players</h3>
              <p className="text-3xl font-bold text-white">{leaderboard.length}</p>
            </div>
          </div>
          <div className="card rounded-2xl animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white">Top Winner</h3>
              <p className="text-xl font-bold text-green-400">
                {leaderboard.length > 0 ? leaderboard[0].name : 'N/A'}
              </p>
            </div>
          </div>
          <div className="card rounded-2xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white">Highest Winnings</h3>
              <p className="text-xl font-bold text-green-400">
                {leaderboard.length > 0 ? (
                  <AnimatedValue 
                    value={leaderboard[0].netWinnings} 
                    className="text-green-400"
                  />
                ) : '$0.00'}
              </p>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="card rounded-2xl overflow-hidden scrollbar-hide animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Total Bets
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Won
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Lost
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Net Winnings
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {leaderboard.map((player, index) => (
                  <tr 
                    key={player.userId}
                    className={`hover:bg-gray-750 transition-colors animate-slide-in-right ${
                      player.userId === user?._id ? 'bg-blue-900/20 border-l-4 border-blue-500' : ''
                    }`}
                    style={{ animationDelay: `${0.6 + (index * 0.08)}s` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRankBadge(player.rank)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {player.name}
                            {player.userId === user?._id && (
                              <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {player.totalBets}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-medium">
                      ${player.totalWon.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-400 font-medium">
                      ${player.totalLost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-bold ${getNetWinningsColor(player.netWinnings)}`}>
                        <AnimatedValue 
                          value={player.netWinnings} 
                          className={getNetWinningsColor(player.netWinnings)}
                        />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {leaderboard.length === 0 && (
            <div className="text-center py-12 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No completed bets yet</h3>
              <p className="text-gray-500">
                Complete some bets to see the leaderboard in action!
              </p>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div className="text-center mt-8 animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <button
            onClick={fetchLeaderboard}
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors font-medium"
          >
            Refresh Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboards; 