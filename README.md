# Real Time Chat App

A full-stack real-time chat application built with the MERN stack, featuring instant messaging, online status tracking, and a responsive UI.

**Live Demo:** https://chatapp-qmmc.onrender.com

## Tech Stack

| Backend | Frontend |
|---------|----------|
| Express 5 | React 18 |
| MongoDB + Mongoose | Vite 6 |
| Socket.io | TailwindCSS 4 |
| JWT + bcrypt | DaisyUI 5 |
| | Zustand |

## Features

- **JWT Authentication** - Secure signup/login with httpOnly cookies
- **Real-time Messaging** - Instant message delivery via Socket.io
- **Online Status** - Live online/offline user indicators
- **User Search** - Filter conversations by name
- **Auto Avatars** - Profile pictures generated based on gender
- **Responsive Design** - Mobile-friendly with collapsible sidebar
- **Persistent Sessions** - Stay logged in across browser sessions

## Project Structure

```
ChatApp/
├── Backend/
│   ├── controllers/     # Auth, message, user logic
│   ├── models/          # User, Message, Conversation schemas
│   ├── routes/          # API endpoint definitions
│   ├── middleware/      # JWT protection middleware
│   ├── socket/          # Socket.io setup & events
│   └── server.js        # Express server entry
├── Frontend/
│   ├── src/
│   │   ├── pages/       # Home, Login, SignUp
│   │   ├── components/  # Sidebar, Messages, UI components
│   │   ├── context/     # Auth & Socket contexts
│   │   ├── hooks/       # Custom React hooks
│   │   └── zustand/     # State management
│   └── vite.config.js
└── package.json
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |

### Messages (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/:id` | Get conversation with user |
| POST | `/api/messages/send/:id` | Send message to user |

### Users (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users for sidebar |

## Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `getOnlineUsers` | Server → Client | Broadcasts online user IDs |
| `newMessage` | Server → Client | Delivers new message to recipient |

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
- `gender` - male/female (for avatar generation)
- `profilePic` - Auto-generated avatar URL

### Message
- `senderId` - Reference to User
- `receiverId` - Reference to User
- `message` - Text content
- `createdAt` - Timestamp

### Conversation
- `participants` - Array of User references
- `messages` - Array of Message references
