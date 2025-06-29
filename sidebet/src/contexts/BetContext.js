import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const BetContext = createContext();

export const useBets = () => {
  const context = useContext(BetContext);
  if (!context) {
    throw new Error('useBets must be used within a BetProvider');
  }
  return context;
};

export const BetProvider = ({ children }) => {
  const { jwt, user } = useAuth();
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBets = async () => {
      if (!jwt) {
        setBets([]);
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/bets/my-bets', { token: jwt });
        setBets(res.data.bets || []);
      } catch (err) {
        setBets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBets();
  }, [jwt]);

  const createBet = async (betData) => {
    if (!jwt) throw new Error('Not authenticated');
    const res = await api.post('/bets', betData, { token: jwt });
    setBets((prev) => [res.data.bet, ...prev]);
    return res.data.bet;
  };

  const acceptBet = async (betId) => {
    if (!jwt) throw new Error('Not authenticated');
    const res = await api.post(`/bets/${betId}/accept`, {}, { token: jwt });
    setBets((prev) =>
      prev.map((bet) => (bet._id === betId ? res.data.bet : bet))
    );
    return res.data.bet;
  };

  const deleteBet = async (betId) => {
    if (!jwt) throw new Error('Not authenticated');
    await api.delete(`/bets/${betId}`, { token: jwt });
    setBets((prev) => prev.filter((bet) => bet._id !== betId));
  };

  const markBetAsWon = async (betId) => {
    if (!jwt) throw new Error('Not authenticated');
    const res = await api.post(`/bets/${betId}/mark-won`, {}, { token: jwt });
    setBets((prev) =>
      prev.map((bet) => (bet._id === betId ? res.data.bet : bet))
    );
    return res.data.bet;
  };

  const markBetAsLost = async (betId) => {
    if (!jwt) throw new Error('Not authenticated');
    const res = await api.post(`/bets/${betId}/mark-lost`, {}, { token: jwt });
    setBets((prev) =>
      prev.map((bet) => (bet._id === betId ? res.data.bet : bet))
    );
    return res.data.bet;
  };

  const getBetById = async (betId) => {
    const res = await api.get(`/bets/${betId}`, { token: jwt });
    return res.data.bet;
  };

  const getBetsByCreator = () => {
    if (!user) return [];
    return bets.filter((bet) => bet.creator && bet.creator._id === user._id);
  };

  const getBetsByAcceptor = () => {
    if (!user) return [];
    return bets.filter((bet) => bet.acceptedBy && bet.acceptedBy._id === user._id);
  };

  const getAllBets = () => bets;

  const refreshBets = async () => {
    if (!jwt) return;
    try {
      const res = await api.get('/bets/my-bets', { token: jwt });
      setBets(res.data.bets || []);
    } catch (err) {
      console.error('Error refreshing bets:', err);
    }
  };

  const value = {
    bets,
    createBet,
    acceptBet,
    deleteBet,
    markBetAsWon,
    markBetAsLost,
    getBetById,
    getBetsByCreator,
    getBetsByAcceptor,
    getAllBets,
    refreshBets,
    loading,
  };

  return (
    <BetContext.Provider value={value}>
      {!loading && children}
    </BetContext.Provider>
  );
}; 
