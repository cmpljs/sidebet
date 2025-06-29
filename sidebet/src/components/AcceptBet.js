import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBets } from '../contexts/BetContext';

const AcceptBet = () => {
  const { betId } = useParams();
  const { user } = useAuth();
  const { getBetById, acceptBet } = useBets();
  const navigate = useNavigate();
  
  const [bet, setBet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    const fetchBet = async () => {
      setLoading(true);
      setError('');
      try {
        const foundBet = await getBetById(betId);
        setBet(foundBet);
      } catch (err) {
        setError('Bet not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchBet();
    // eslint-disable-next-line
  }, [betId]);

  const handleAcceptBet = async () => {
    if (!user) {
      setError('You must be logged in to accept a bet');
      return;
    }

    if (bet.creator._id === user._id) {
      setError('You cannot accept your own bet');
      return;
    }

    if (bet.acceptedBy) {
      setError('This bet has already been accepted');
      return;
    }

    setAccepting(true);
    setError('');
    setSuccess('');

    try {
      await acceptBet(betId);
      setSuccess('Bet accepted successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError('Failed to accept bet. Please try again.');
    } finally {
      setAccepting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">Loading bet...</div>
      </div>
    );
  }

  if (error && !bet) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Bet Not Found</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link to="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!bet) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Accept Bet</h1>
        <p className="text-gray-400">
          Review the bet details and accept the challenge!
        </p>
      </div>

      <div className="card">
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">{bet.name}</h2>
            <p className="text-gray-300">{bet.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Bet Size</h3>
              <p className="text-2xl font-bold text-green-400">${bet.size}</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Created</h3>
              <p className="text-white">{formatDate(bet.createdAt)}</p>
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Status</h3>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                bet.status === 'pending' 
                  ? 'bg-yellow-900 text-yellow-200' 
                  : bet.status === 'accepted'
                  ? 'bg-green-900 text-green-200'
                  : 'bg-gray-900 text-gray-200'
              }`}>
                {bet.status === 'pending' ? 'Pending' : 
                 bet.status === 'accepted' ? 'Accepted' : 'Completed'}
              </span>
              {bet.acceptedBy && (
                <span className="text-gray-300 text-sm">
                  • Accepted by {bet.acceptedBy.name || 'User'}
                </span>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            {!user ? (
              <div className="flex-1">
                <p className="text-gray-400 mb-4">You need to be logged in to accept this bet.</p>
                <Link to="/login" className="btn-primary w-full">
                  Login to Accept
                </Link>
              </div>
            ) : bet.creator._id === user._id ? (
              <div className="flex-1">
                <p className="text-gray-400 mb-4">You cannot accept your own bet.</p>
                <Link to="/dashboard" className="btn-secondary w-full">
                  Go to Dashboard
                </Link>
              </div>
            ) : bet.acceptedBy ? (
              <div className="flex-1">
                <p className="text-gray-400 mb-4">This bet has already been accepted.</p>
                <Link to="/dashboard" className="btn-secondary w-full">
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <button
                onClick={handleAcceptBet}
                disabled={accepting}
                className="btn-success flex-1 py-3"
              >
                {accepting ? 'Accepting...' : 'Accept Bet'}
              </button>
            )}
            
            <Link to="/dashboard" className="btn-secondary px-4 py-1 text-sm text-center">
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptBet; 