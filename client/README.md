# Trello Sync Client

React-based frontend application for the Trello Sync project with real-time updates.

## 📋 Overview

A modern Trello clone built with React and Vite, featuring:
- Real-time synchronization with Trello API
- WebSocket-based live updates
- Drag-and-drop functionality
- Beautiful, responsive UI

## 🛠️ Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **@dnd-kit** - Drag and drop functionality
- **ESLint** - Code linting

## 📁 Project Structure

```
client/trello-app/
├── public/               # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── Board.jsx    # Board container
│   │   ├── List.jsx     # List component
│   │   └── Card.jsx     # Card component
│   ├── services/
│   │   └── api.js       # API service layer
│   ├── assets/          # Images, icons
│   ├── App.jsx          # Main app component
│   ├── App.css          # App styles
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── eslint.config.js     # ESLint configuration
```

## 📦 Installation

```powershell
# Navigate to client directory
cd client\trello-app

# Install dependencies
npm install
```

## 🚀 Running the Application

### Development Mode

```powershell
# Start development server
npm run dev
```

Application will run on `http://localhost:5173`

### Production Build

```powershell
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔌 Backend Connection

The client connects to the backend API at `http://localhost:5000`. Ensure the backend server is running before starting the client.

### API Configuration

Edit `src/services/api.js` to change the API base URL:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### WebSocket Configuration

Socket.IO connects automatically to the backend server. Update in `App.jsx` if needed:

```javascript
const socket = io('http://localhost:5000');
```

## 🎨 Features

### Real-time Updates
- Automatic synchronization with Trello
- Live updates across all connected clients
- WebSocket-based communication

### Board Management
- View all Trello boards
- Create new boards
- Switch between boards
- Delete boards

### Task Management
- Create new tasks (cards)
- Update task details
- Delete tasks
- Real-time task updates

### Drag and Drop
- Reorder cards within lists
- Move cards between lists
- Powered by @dnd-kit

## 🧪 Development

### Code Linting

```powershell
# Run ESLint
npm run lint
```

### Project Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Styling

The application uses CSS modules with the following structure:

- `index.css` - Global styles
- `App.css` - App-level styles
- `Board.css` - Board component styles
- `List.css` - List component styles
- `Card.css` - Card component styles

## 📡 API Service

The `api.js` service provides:

```javascript
// Boards
getBoards()
getBoard(id)
createBoard(name)
updateBoard(id, updates)
deleteBoard(id)

// Tasks
getTasks(listId)
getTask(id)
createTask(listId, task)
updateTask(id, updates)
deleteTask(id)

// Webhooks
getWebhooks()
createWebhook(callbackURL, idModel)
deleteWebhook(id)
```

## 🔧 Configuration Files

### vite.config.js
- React plugin configuration
- Build settings
- Development server options

### eslint.config.js
- React hooks rules
- React refresh rules
- Code quality standards

## 🐛 Debugging

### Check Backend Connection

Open browser console and verify:
```javascript
// WebSocket connection
Socket connected: true

// API endpoint
console.log(await fetch('http://localhost:5000/api/boards'))
```

### Common Issues

**Backend not running:**
```
Error: connect ECONNREFUSED 127.0.0.1:5000
```
Solution: Start the backend server first

**CORS errors:**
- Ensure backend has CORS enabled
- Check API_BASE_URL in `api.js`

**WebSocket disconnection:**
- Verify backend Socket.IO server is running
- Check browser console for connection errors

## 🎯 Usage

1. **Start the Backend**: Ensure backend is running on port 5000
2. **Start the Client**: Run `npm run dev`
3. **Open Browser**: Navigate to `http://localhost:5173`
4. **Select Board**: Choose a Trello board from the dropdown
5. **Manage Tasks**: Create, update, and delete tasks
6. **Real-time Sync**: Changes appear instantly across all clients

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Deployment

### Build for Production

```powershell
npm run build
```

Output will be in the `dist/` directory.

### Deploy to Vercel

```powershell
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to Netlify

```powershell
# Build the project
npm run build

# Deploy dist/ folder to Netlify
```

**Important**: Update API_BASE_URL and socket connection to production backend URL.

## 🔒 Security

- API calls are made over HTTP (use HTTPS in production)
- No sensitive data stored in localStorage
- Environment-based configuration recommended for production

## 📄 License

ISC
