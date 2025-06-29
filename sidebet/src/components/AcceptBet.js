import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBets } from '../contexts/BetContext';

const AcceptBet = () => {
  const { betId } = useParams();
  const { user } = useAuth();
  const { getBetById, acceptBet, deleteBet } = useBets();
  const navigate = useNavigate();
  
  const [bet, setBet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [accepting, setAccepting] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError('Failed to accept bet. Please try again.');
    } finally {
      setAccepting(false);
    }
  };

  const handleDeleteBet = async () => {
    if (!user) {
      setError('You must be logged in to delete a bet');
      return;
    }

    if (bet.creator._id !== user._id) {
      setError('You can only delete your own bets');
      return;
    }

    if (bet.acceptedBy) {
      setError('Cannot delete a bet that has already been accepted');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this bet? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    setError('');
    setSuccess('');

    try {
      await deleteBet(betId);
      setSuccess('Bet deleted successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to delete bet. Please try again.');
    } finally {
      setDeleting(false);
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

  const getStatusFromUserPerspective = (bet) => {
    if (!user) return bet.status;
    
    if (bet.status === 'pending' || bet.status === 'accepted') {
      return bet.status;
    }
    
    if (bet.status === 'won' || bet.status === 'lost') {
      const isCreator = bet.creator._id === user._id;
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
      case 'accepted':
        return 'bg-yellow-900 text-yellow-200';
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
      default:
        return 'text-green-400';
    }
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
    <div className="max-w-2xl mx-auto relative">
      {(accepting || deleting) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-white">
              {accepting ? 'Accepting bet...' : 'Deleting bet...'}
            </span>
          </div>
        </div>
      )}
      <div className="mb-8">
        <div className="flex items-center justify-end mb-4">
          <Link to="/dashboard" className="btn-secondary">
            Back
          </Link>
        </div>
        {user && bet.creator._id === user._id ? (
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Your Bet</h1>
              <p className="text-gray-400">
                Share this bet with friends to challenge them!
              </p>
            </div>
            <button
              onClick={() => {
                const shareableLink = `${window.location.origin}/accept-bet/${bet._id}`;
                navigator.clipboard.writeText(shareableLink);
                setSuccess('Link copied to clipboard!');
              }}
              className="btn-primary px-6 py-3"
            >
              Copy Link
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Accept Bet</h1>
            <p className="text-gray-400">
              Review the bet details and accept the challenge!
            </p>
          </div>
        )}
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
              <p className={`text-2xl font-bold ${getMoneyColor(getStatusFromUserPerspective(bet))}`}>${bet.size}</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Created</h3>
              <p className="text-white">{formatDate(bet.createdAt)}</p>
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Status</h3>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(getStatusFromUserPerspective(bet))}`}>
                {getStatusText(getStatusFromUserPerspective(bet))}
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
                {!bet.acceptedBy && (
                  <button
                    onClick={handleDeleteBet}
                    disabled={deleting}
                    className="btn-danger w-full mb-4"
                  >
                    {deleting ? 'Deleting...' : 'Delete Bet'}
                  </button>
                )}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptBet; 