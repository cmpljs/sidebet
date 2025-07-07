import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBets } from '../contexts/BetContext';
import { UI_CONFIG } from '../config/uiConfig';

const CreateBet = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    size: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { createBet } = useBets();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!formData.name || !formData.description || !formData.size) {
        throw new Error('Please fill in all fields');
      }

      const betSize = parseFloat(formData.size);
      if (isNaN(betSize) || betSize <= 0) {
        throw new Error('Bet size must be a positive number');
      }

      const newBet = await createBet({
        name: formData.name.trim(),
        description: formData.description.trim(),
        size: betSize,
      });

      setSuccess('Bet created successfully!');
      setFormData({ name: '', description: '', size: '' });
      
      const shareableLink = `${window.location.origin}/accept-bet/${newBet._id}`;
      setSuccess(`Bet created successfully! Share this link: ${shareableLink}`);
      
    } catch (err) {
      setError(err.message || 'Failed to create bet');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Link copied to clipboard!');
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-transparent text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{UI_CONFIG.CREATE_BET_TITLE}</h1>
          <p className="text-gray-400 text-lg">
            {UI_CONFIG.CREATE_BET_DESCRIPTION}
          </p>
          </div>

        {/* Content */}
        <div className="card rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded-lg">
              {success}
              {success.includes('Share this link:') && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(success.split('Share this link: ')[1])}
                    className="btn-secondary text-sm"
                  >
                    Copy Link
                  </button>
                </div>
              )}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Bet Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="e.g., Navi vs Spirit"
              maxLength={100}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Bet Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              className="input-field w-full h-32 resize-none"
              placeholder="Describe the terms and conditions of the bet..."
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>

          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-300 mb-2">
              Bet Size ($) *
            </label>
            <input
              id="size"
              name="size"
              type="number"
              step="0.01"
              min="0.01"
              required
              value={formData.size}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="e.g., 100"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 py-3"
            >
              {loading ? UI_CONFIG.CREATING_BET_TEXT : UI_CONFIG.CREATE_BET_TEXT}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary flex-1 py-3"
            >
              Cancel
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBet; 
