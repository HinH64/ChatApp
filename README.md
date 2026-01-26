# Real Time Chat App

A full-stack real-time chat application built with the MERN stack, featuring instant messaging, online status tracking, a Werewords party game, and admin management.

**Live Demo:** https://chatapp-qmmc.onrender.com

## Tech Stack

| Backend | Frontend |
|---------|----------|
| Express 5 | React 18 |
| MongoDB + Mongoose | Vite 6 |
| Socket.io | TailwindCSS 4 |
| JWT + bcrypt | DaisyUI 5 |
| TypeScript | Zustand |

## Features

- **JWT Authentication** - Secure signup/login with httpOnly cookies
- **Real-time Messaging** - Instant message delivery via Socket.io
- **Online Status** - Live online/offline user indicators
- **User Search** - Filter conversations by name in real-time
- **Profile Management** - Edit profile, upload custom avatar, change password
- **Dark/Light Theme** - Toggle between themes
- **Werewords Game** - Multiplayer party game with roles (Mayor, Seer, Werewolf, Villagers)
- **Admin Panel** - User management for admins (view, edit roles, delete users)
- **Responsive Design** - Mobile-friendly with collapsible sidebar

## Project Structure

```
ChatApp/
├── Backend/
│   ├── controllers/     # Auth, message, user, game, admin logic
│   ├── models/          # User, Message, Conversation, Game schemas
│   ├── routes/          # API endpoint definitions
│   ├── middleware/      # JWT protection, admin-only, file upload
│   ├── socket/          # Socket.io setup & game event handlers
│   └── server.ts        # Express server entry
├── Frontend/
│   ├── src/
│   │   ├── pages/       # Home, Login, SignUp, Profile, Admin, Game
│   │   ├── components/  # Sidebar, Messages, Game, Panels, Navigation
│   │   ├── context/     # Auth, Socket, Game, Theme contexts
│   │   ├── hooks/       # Custom React hooks for API & socket
│   │   ├── zustand/     # State management stores
│   │   └── types/       # TypeScript type definitions
│   └── vite.config.ts
└── package.json
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| PUT | `/api/auth/password` | Change password |

### Users (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users for sidebar |
| GET | `/api/users/profile` | Get current user profile |
| PUT | `/api/users/profile` | Update profile info |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users/profile/avatar` | Upload avatar image |
| DELETE | `/api/users/profile/avatar` | Reset to default avatar |

### Messages (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/:id` | Get conversation with user |
| POST | `/api/messages/send/:id` | Send message to user |

### Games (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/games/create` | Create a new game |
| POST | `/api/games/join` | Join game by code |
| GET | `/api/games/` | Get user's active games |
| GET | `/api/games/categories` | Get available word categories |
| GET | `/api/games/:code` | Get game by code |
| PATCH | `/api/games/:code/settings` | Update game settings |
| DELETE | `/api/games/:code/leave` | Leave a game |

### Admin (Protected, Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| GET | `/api/admin/users/:id` | Get user details |
| PATCH | `/api/admin/users/:id/role` | Update user role |
| DELETE | `/api/admin/users/:id` | Delete user |

## Socket.io Events

### Chat Events
| Event | Direction | Description |
|-------|-----------|-------------|
| `getOnlineUsers` | Server → Client | Broadcasts online user IDs |
| `newMessage` | Server → Client | Delivers new message to recipient |

### Game Events
| Event | Direction | Description |
|-------|-----------|-------------|
| `game:join` | Client → Server | Player joins game room |
| `game:leave` | Client → Server | Player leaves game |
| `game:start` | Client → Server | Host starts game (4+ players) |
| `game:selectWord` | Client → Server | Mayor selects magic word |
| `game:question` | Client → Server | Player asks a question |
| `game:mayorResponse` | Client → Server | Mayor responds with token |
| `game:timeUp` | Client → Server | Day phase timer ends |
| `game:vote` | Client → Server | Player casts vote |
| `game:playerJoined` | Server → Client | Player joined broadcast |
| `game:playerLeft` | Server → Client | Player left broadcast |
| `game:started` | Server → Client | Game started with roles |
| `game:dayStart` | Server → Client | Day phase begins |
| `game:newQuestion` | Server → Client | New question asked |
| `game:wordGuessed` | Server → Client | Word guessed correctly |
| `game:tokenResponse` | Server → Client | Mayor token response |
| `game:votingStart` | Server → Client | Voting phase begins |
| `game:voteCast` | Server → Client | Vote counted |
| `game:gameOver` | Server → Client | Game ends with results |
| `game:error` | Server → Client | Error message |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8000
MONGO_DB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Installation

```bash
# Install all dependencies
npm run build
```

Or manually:

```bash
npm install
npm install --prefix Frontend
npm run build --prefix Frontend
```

### Development

```bash
# Terminal 1: Start backend with auto-reload
npm run server

# Terminal 2: Start frontend dev server
cd Frontend && npm run dev
```

### Production

```bash
npm run build
npm start
```

## Database Models

### User
- `fullName` - Display name
- `username` - Unique login identifier
- `password` - Bcrypt hashed
- `gender` - male/female (for default avatar)
- `profilePic` - Avatar URL (custom or auto-generated)
- `email` - Optional email address
- `bio` - User bio/description
- `role` - user/admin
- `lastSeen` - Last activity timestamp

### Message
- `senderId` - Reference to User
- `receiverId` - Reference to User
- `message` - Text content
- `createdAt` - Timestamp

### Conversation
- `participants` - Array of User references
- `messages` - Array of Message references

### Game (Werewords)
- `code` - Unique game code
- `host` - Reference to User
- `players` - Array with role and connection status
- `status` - lobby/night/day/voting/ended
- `magicWord` - The word to guess
- `wordOptions` - Word choices for mayor
- `tokens` - Yes/No/Maybe/SoClose counts
- `questions` - Asked questions with responses
- `votes` - Player votes
- `settings` - Word category, difficulty, day duration
- `winner` - villagers/werewolves/none
