# Dhandho - Indian Business Hustle Card Game

An Indian-themed version of Monopoly Deal built as a Progressive Web App (PWA).

## 🎮 About

Dhandho is a high-speed trading card game where players compete to collect 3 complete property sets. The game features iconic Indian cities and landmarks, with culturally relevant action cards inspired by Indian business culture.

## 🏗️ Tech Stack

- **Game Logic**: [boardgame.io](https://boardgame.io/) - State management
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS (Flat 2.5D aesthetic)
- **Icons**: Emojis (or lucide-react when available)

## 🎯 Game Rules

### Objective
Be the first player to collect 3 complete property sets.

### Property Sets (Indian Cities)
- **Jaipur** (Pink - 2 cards): Hawa Mahal, City Palace - ₹2Cr each
- **Mumbai** (Dark Blue - 2 cards): Antilia, Sea Link - ₹4Cr each
- **Delhi** (Green - 3 cards): Lutyens Delhi, India Gate, Red Fort - ₹4Cr each
- **Bangalore** (Yellow - 3 cards): Indiranagar, Tech Park, Cubbon Park - ₹3Cr each
- **Kolkata** (Red - 3 cards): Howrah Bridge, Victoria Memorial, Park Street - ₹3Cr each
- **Transport** (Black - 4 cards): Metro, Rickshaw, Local Train, Auto - ₹2Cr each
- **Utilities** (Light Green - 2 cards): Adani Power, Jio Fiber - ₹2Cr each

### Action Cards
- **Scam 1992** 🎭: Steal a completed property set from any opponent
- **Abba Nahi Manenge** 🚫: Just Say No - Cancel any action played against you
- **Vasooli Bhai** 💰: Debt Collector - Force a player to pay ₹5Cr
- **Shagun** 🎉: It's your birthday - All players pay you ₹2Cr
- **Jugaad** 🎯: Sly Deal - Steal a single property from any opponent
- **Pass Go** 🎲: Draw 2 extra cards from the deck

### How to Play
1. Draw 2 cards at the start of your turn
2. Play up to 3 cards per turn:
   - Play properties to build sets
   - Play money to your bank
   - Play action cards to disrupt opponents
3. Discard down to 7 cards at end of turn
4. First to 3 complete sets wins!

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
dhandho-game/
├── src/
│   ├── game/
│   │   ├── Game.js          # boardgame.io game logic
│   │   └── constants.js     # Game data (properties, actions, money)
│   ├── components/
│   │   ├── Card.jsx         # Card component (property/action/money)
│   │   └── GameBoard.jsx    # Main game board layout
│   ├── App.jsx              # boardgame.io client wrapper
│   ├── main.jsx             # React entry point
│   └── index.css            # Tailwind + custom styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 Design Philosophy

The game follows a **Flat 2.5D aesthetic** with:
- Vibrant gradients and modern color palettes
- Glass morphism effects
- Smooth micro-animations on hover
- Mobile-first responsive design
- Indian cultural theming throughout

## 🎯 Future Enhancements

- [ ] Online multiplayer (Socket.io integration)
- [ ] Sound effects and music
- [ ] Additional action cards
- [ ] AI opponents
- [ ] Leaderboard and statistics
- [ ] PWA offline support
- [ ] Mobile app (React Native)

## 📝 License

This is a fan-made project for educational purposes.

## 🙏 Credits

Inspired by Monopoly Deal by Hasbro. Indian theme and cultural references are original interpretations.

---

Built with ❤️ using boardgame.io, React, and Tailwind CSS
