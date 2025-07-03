# UI Text Customization

This application now supports environment variables to customize the text values displayed throughout the interface.

## Available Environment Variables

Create a `.env` file in the `sidebet` directory with the following variables:

```env
# Logo and branding
REACT_APP_LOGO_TEXT=SideBet

# Navigation items
REACT_APP_DASHBOARD_TEXT=Dashboard
REACT_APP_CREATE_BET_TEXT=Create Bet
REACT_APP_LEADERBOARDS_TEXT=Leaderboards
```

## How to Use

1. **Create a `.env` file** in the `sidebet` directory
2. **Add the environment variables** you want to customize
3. **Restart your development server** for changes to take effect

## Example Customization

If you want to change the logo text from "SideBet" to "BetApp":

```env
REACT_APP_LOGO_TEXT=BetApp
```

## Default Values

If no environment variables are set, the application will use these default values:

- `REACT_APP_LOGO_TEXT`: "SideBet"
- `REACT_APP_DASHBOARD_TEXT`: "Dashboard"
- `REACT_APP_CREATE_BET_TEXT`: "Create Bet"
- `REACT_APP_LEADERBOARDS_TEXT`: "Leaderboards"

## Important Notes

- Environment variables must start with `REACT_APP_` to be accessible in React applications
- Changes require a server restart to take effect
- The `.env` file should not be committed to version control (it's already in `.gitignore`)

## Configuration File

The UI configuration is managed in `src/config/uiConfig.js`. This file contains:

- All configurable text values
- Helper functions for text formatting
- Fallback values for missing environment variables

You can also modify this file directly if you prefer not to use environment variables. 