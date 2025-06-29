import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBets } from '../contexts/BetContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { getBetsByCreator, getBetsByAcceptor, loading } = useBets();
  const [activeTab, setActiveTab] = useState('created');

  const createdBets = getBetsByCreator();
  const acceptedBets = getBetsByAcceptor();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900 text-yellow-200';
      case 'accepted':
        return 'bg-green-900 text-green-200';
      case 'completed':
        return 'bg-blue-900 text-blue-200';
      default:
        return 'bg-gray-900 text-gray-200';
    }
  };

  const BetCard = ({ bet, showCreator = false }) => (
    <Link 
      to={`/accept-bet/${bet._id}`}
      className="card hover:bg-gray-750 transition-colors duration-200 block"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-white">{bet.name}</h3>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bet.status)}`}>
          {bet.status === 'pending' ? 'Pending' : 
           bet.status === 'accepted' ? 'Accepted' : 'Completed'}
        </span>
      </div>
      
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{bet.description}</p>
      
      <div className="flex justify-between items-center">
        <div className="text-green-400 font-bold">${bet.size}</div>
        <div className="text-gray-400 text-sm">{formatDate(bet.createdAt)}</div>
      </div>
      
      {showCreator && bet.acceptedBy && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-gray-400 text-sm">
            Accepted by: <span className="text-blue-400">{bet.acceptedBy?.name || 'User'}</span>
          </p>
        </div>
      )}
      
      <div className="mt-4">
        <span className="text-blue-400 hover:text-blue-300 text-sm font-medium">
          View Details →
        </span>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">Loading your bets...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Bets Dashboard</h1>
        <p className="text-gray-400">
          Welcome back, {user.name}! Manage your bets and track your challenges.
        </p>
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

      {/* Tab Navigation */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('created')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'created'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Created Bets ({createdBets.length})
          </button>
          <button
            onClick={() => setActiveTab('accepted')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'accepted'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Accepted Bets ({acceptedBets.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'created' && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Bets You've Created</h2>
            {createdBets.length === 0 ? (
              <div className="card text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No bets created yet</h3>
                <p className="text-gray-400 mb-4">
                  Create your first bet and challenge your friends!
                </p>
                <Link to="/create-bet" className="btn-primary">
                  Create Your First Bet
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdBets.map((bet) => (
                  <BetCard key={bet._id} bet={bet} showCreator={true} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'accepted' && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Bets You've Accepted</h2>
            {acceptedBets.length === 0 ? (
              <div className="card text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No accepted bets yet</h3>
                <p className="text-gray-400 mb-4">
                  Accept a bet from a friend to get started!
                </p>
                <p className="text-gray-500 text-sm">
                  Ask your friends to share their bet links with you.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {acceptedBets.map((bet) => (
                  <BetCard key={bet._id} bet={bet} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 