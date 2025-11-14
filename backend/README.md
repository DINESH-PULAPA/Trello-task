# Trello Sync Backend

Node.js/Express backend server for the Trello Sync application with real-time WebSocket support.

## 📋 Overview

This backend provides:
- RESTful API endpoints for Trello operations
- Real-time WebSocket communication using Socket.IO
- Webhook integration with Trello API
- CORS-enabled for frontend communication

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **Axios** - HTTP client for Trello API
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
backend/
├── routes/
│   ├── boards.js      # Board CRUD operations
│   ├── tasks.js       # Task/Card CRUD operations
│   └── webhooks.js    # Webhook management
├── server.js          # Main server file
├── package.json       # Dependencies
├── .env              # Environment variables (create this)
└── test-endpoints.html # API testing UI
```

## ⚙️ Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
TRELLO_KEY=your_trello_api_key
TRELLO_TOKEN=your_trello_token
```

### Getting Trello Credentials

1. **API Key**: Visit https://trello.com/power-ups/admin
2. **Token**: Generate at:
   ```
   https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&name=TrelloSync&key=YOUR_API_KEY
   ```

## 📦 Installation

```powershell
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with your credentials
# (See Environment Variables section above)

# Start the server
node server.js
```

## 🚀 Running the Server

```powershell
# Development mode
node server.js
```

Server will start on `http://localhost:5000`

## 📡 API Endpoints

### Boards

- `GET /api/boards` - Get all boards
- `GET /api/boards/:id` - Get a specific board
- `POST /api/boards` - Create a new board
- `PUT /api/boards/:id` - Update a board
- `DELETE /api/boards/:id` - Delete a board

### Tasks (Cards)

- `GET /api/tasks` - Get all tasks from a list
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Webhooks

- `GET /api/webhooks` - List all webhooks
- `POST /api/webhooks` - Create a webhook
- `DELETE /api/webhooks/:id` - Delete a webhook
- `HEAD /api/webhooks/callback` - Webhook verification
- `POST /api/webhooks/callback` - Webhook event handler

## 🔌 WebSocket Events

### Server Emits

- `boardsUpdated` - When boards are modified
- `tasksUpdated` - When tasks are modified
- `cardCreated` - When a new card is created
- `cardUpdated` - When a card is updated
- `cardDeleted` - When a card is deleted

### Client Listens

Clients should listen to these events for real-time updates.

## 🧪 Testing

Use `test-endpoints.html` for manual API testing:

```powershell
# Open in browser
start test-endpoints.html
```

Or test with PowerShell:

```powershell
# Get all boards
curl http://localhost:5000/api/boards

# Create a board
curl -X POST http://localhost:5000/api/boards -H "Content-Type: application/json" -d '{"name":"My Board"}'
```

## 🔗 Webhook Setup

For real-time Trello synchronization:

1. Install ngrok: `choco install ngrok`
2. Run ngrok: `ngrok http 5000`
3. Use the provided PowerShell script:

```powershell
.\setup-webhook.ps1
```

Or manually create webhook:

```powershell
$ngrokUrl = "https://your-ngrok-url.ngrok.io"
$boardId = "your-board-id"
curl -X POST "https://api.trello.com/1/webhooks?key=$env:TRELLO_KEY&token=$env:TRELLO_TOKEN" -H "Content-Type: application/json" -d "{`"callbackURL`":`"$ngrokUrl/api/webhooks/callback`",`"idModel`":`"$boardId`"}"
```

## 🐛 Debugging

Check server logs for:
- Environment variable validation
- API request/response details
- WebSocket connection events
- Webhook callbacks

## 📝 Common Issues

**Port already in use:**
```powershell
# Find process on port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <process_id> /F
```

**Missing environment variables:**
```
❌ Missing TRELLO_KEY or TRELLO_TOKEN in .env file
```
Solution: Ensure `.env` file exists with valid credentials.

**CORS errors:**
- Server is configured to allow all origins in development
- Update `cors` configuration in `server.js` for production

## 🔒 Security Notes

- Never commit `.env` file to version control
- Restrict CORS origins in production
- Use HTTPS for webhook callbacks in production
- Rotate Trello tokens periodically

## 📄 License

ISC
