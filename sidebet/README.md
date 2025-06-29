# SideBet - React Betting App

A modern React application for creating and accepting bets with friends. Built with React, React Router, and Tailwind CSS.

## Features

### 🔐 Authentication
- User registration and login with email/password
- Local storage-based authentication (mock backend)
- Protected routes for authenticated users

### 🎯 Bet Creation
- Create bets with name, description, and bet size
- Automatic generation of unique bet IDs
- Shareable links for bet acceptance
- Form validation and error handling

### ✅ Bet Acceptance
- View bet details via shared links
- Accept bets with one click
- Prevent users from accepting their own bets
- Status tracking (pending, accepted, completed)

### 📊 Dashboard
- **Created Bets**: View all bets you've created
- **Accepted Bets**: View all bets you've accepted
- Tabbed interface for easy navigation
- Real-time status updates

### 🎨 UI/UX
- Modern, responsive design
- Dark theme with blue, black, and gray colors
- Clean and intuitive user interface
- Mobile-friendly layout

## Tech Stack

- **Frontend**: React 18
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Data Persistence**: Local Storage
- **Icons**: Heroicons (SVG)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sidebet
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/          # React components
│   ├── Navbar.js       # Navigation bar
│   ├── Login.js        # Login form
│   ├── Register.js     # Registration form
│   ├── Dashboard.js    # Main dashboard
│   ├── CreateBet.js    # Bet creation form
│   └── AcceptBet.js    # Bet acceptance page
├── contexts/           # React contexts
│   ├── AuthContext.js  # Authentication state
│   └── BetContext.js   # Bet data management
├── App.js              # Main app component
├── index.js            # App entry point
└── index.css           # Global styles
```

## Usage

### Creating a Bet

1. Register or login to your account
2. Click "Create New Bet" from the dashboard
3. Fill in the bet details:
   - **Bet Name**: A descriptive title
   - **Bet Description**: Terms and conditions
   - **Bet Size**: Amount in dollars
4. Click "Create Bet"
5. Copy the generated shareable link

### Accepting a Bet

1. Open a shared bet link
2. Review the bet details
3. Click "Accept Bet" to join the challenge
4. The bet will appear in your "Accepted Bets" tab

### Managing Your Bets

- **Dashboard**: View all your bets in organized tabs
- **Created Bets**: See bets you've created and their status
- **Accepted Bets**: See bets you've accepted from others
- **View Details**: Click on any bet to see full details

## Data Storage

The app uses localStorage for data persistence:
- User authentication data
- Bet information and status
- All data is stored locally in the browser

## Customization

### Styling

The app uses Tailwind CSS with a custom dark theme. You can modify colors in:
- `tailwind.config.js` - Theme configuration
- `src/index.css` - Custom styles and utilities

### Adding Features

The modular structure makes it easy to add new features:
- New components in `src/components/`
- Additional contexts in `src/contexts/`
- New routes in `src/App.js`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Future Enhancements

- Real backend integration
- User profiles and avatars
- Bet categories and tags
- Push notifications
- Bet completion tracking
- Payment integration
- Social features (comments, likes)
- Mobile app version