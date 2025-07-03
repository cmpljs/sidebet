// UI Configuration - Text values for the application
// These can be easily modified to change the displayed text throughout the app

export const UI_CONFIG = {
  // Logo and branding
  LOGO_TEXT: process.env.REACT_APP_LOGO_TEXT || 'SideBet',
  
  // Navigation items
  DASHBOARD_TEXT: process.env.REACT_APP_DASHBOARD_TEXT || 'My Bets',
  CREATE_BET_TEXT: process.env.REACT_APP_CREATE_BET_TEXT || 'Create New Bet',
  LEADERBOARDS_TEXT: process.env.REACT_APP_LEADERBOARDS_TEXT || 'Ladder',
  
  // Dashboard specific
  DASHBOARD_TITLE: 'My Bets Dashboard',
  DASHBOARD_WELCOME: 'Welcome back, {name}! Manage your bets and track your challenges.',
  CREATE_NEW_BET_TEXT: 'Create New Bet',
  ALL_YOUR_BETS_TEXT: 'All Your Bets',
  NO_BETS_YET_TEXT: 'No bets yet',
  NO_BETS_DESCRIPTION: 'Create your first bet and challenge your friends!',
  CREATE_FIRST_BET_TEXT: 'Create Your First Bet',
  
  // Create Bet specific
  CREATE_BET_TITLE: 'Create a New Bet',
  CREATE_BET_DESCRIPTION: 'Create a bet and share it with friends to challenge them!',
  CREATING_BET_TEXT: 'Creating Bet...',
  
  // Leaderboards specific
  LEADERBOARDS_DESCRIPTION: 'See who\'s winning the most bets and climbing the ranks',
  REFRESH_LEADERBOARD_TEXT: 'Refresh Leaderboard',
  NO_COMPLETED_BETS_TEXT: 'No completed bets yet',
  NO_COMPLETED_BETS_DESCRIPTION: 'Complete some bets to see the leaderboard in action!'
};

// Helper function to get config value with fallback
export const getUIConfig = (key, fallback = '') => {
  return UI_CONFIG[key] || fallback;
};

// Helper function to format text with placeholders
export const formatUIText = (text, replacements = {}) => {
  let formattedText = text;
  Object.keys(replacements).forEach(key => {
    formattedText = formattedText.replace(`{${key}}`, replacements[key]);
  });
  return formattedText;
}; 