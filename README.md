# Trello Clone - Real-time WebSockets + API Integration

A full-stack Trello clone with real-time synchronization using Trello's REST API and WebSockets.

## 🎯 Features

- ✅ Create, update, and delete Trello boards
- ✅ Create, update, and delete tasks (cards)
- ✅ Real-time updates across all connected clients via WebSockets
- ✅ Trello webhook integration for live sync
- ✅ Beautiful Trello-like UI with React
- ✅ Socket.IO for bi-directional communication

## 📁 Project Structure

```
.
├── backend/              # Node.js/Express backend
│   ├── routes/
│   │   ├── tasks.js     # Task/Card CRUD operations
│   │   ├── boards.js    # Board CRUD operations
│   │   └── webhooks.js  # Webhook management
│   ├── server.js        # Main server file
│   ├── .env             # Environment variables (create this)
│   └── package.json
│
└── client/trello-app/   # React frontend
    ├── src/
    │   ├── components/  # React components
    │   ├── services/    # API service layer
    │   └── App.jsx
    └── package.json
```

## 🔧 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Trello account
- ngrok (for webhook testing)

## 🚀 Setup Instructions

### 1. Get Trello API Credentials

1. Go to https://trello.com/power-ups/admin
2. Click "New" to create a new Power-Up
3. Get your **API Key**
4. Generate a **Token** by visiting:
   ```
   https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&name=TrelloClone&key=YOUR_API_KEY
   ```
5. Save both the API Key and Token

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file and add your credentials:
# PORT=5000
# TRELLO_KEY=your_api_key_here
# TRELLO_TOKEN=your_token_here

# Start the server
node server.js
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client/trello-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Setup Trello Webhook (for real-time updates)

**Step 1: Install ngrok**
```bash
# Download from https://ngrok.com/download
# Or use chocolatey (Windows):
choco install ngrok

# Or use homebrew (Mac):
brew install ngrok
```

**Step 2: Expose your backend**
```bash
ngrok http 5000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

**Step 3: Register webhook**

Use one of these methods:

**Method A: Using the API endpoint**
```bash
POST http://localhost:5000/api/webhooks/create

Body:
{
  "boardId": "YOUR_BOARD_ID",
  "callbackURL": "https://your-ngrok-url.ngrok.io/webhook"
}
```

**Method B: Using curl**
```bash
curl -X POST "https://api.trello.com/1/webhooks?key=YOUR_KEY&token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Trello Board Webhook",
    "callbackURL": "https://your-ngrok-url.ngrok.io/webhook",
    "idModel": "YOUR_BOARD_ID"
  }'
```

**To get your Board ID:**
- Open your Trello board in browser
- Go to `http://localhost:5000/api/boards` to see all your boards with IDs

## 📡 API Endpoints

### Board Endpoints

#### 1. Get All Boards
```http
GET /api/boards
```

#### 2. Create Board
```http
POST /api/boards
Content-Type: application/json

{
  "name": "My New Board",
  "defaultLists": true
}
```

#### 3. Get Lists for Board
```http
GET /api/boards/:boardId/lists
```

### Task Endpoints

#### 1. Get Tasks for List
```http
GET /api/tasks/list/:listId
```

#### 2. Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "listId": "list_id_here",
  "name": "Task Title",
  "desc": "Task Description"
}
```

#### 3. Update Task
```http
PUT /api/tasks/:cardId
Content-Type: application/json

{
  "name": "Updated Title",
  "desc": "Updated Description",
  "idList": "new_list_id_if_moving"
}
```

#### 4. Delete Task
```http
DELETE /api/tasks/:cardId
```

### Webhook Endpoints

#### List Webhooks
```http
GET /api/webhooks/list
```

#### Create Webhook
```http
POST /api/webhooks/create
Content-Type: application/json

{
  "boardId": "board_id",
  "callbackURL": "https://your-ngrok-url.ngrok.io/webhook"
}
```

#### Delete Webhook
```http
DELETE /api/webhooks/:webhookId
```

## 🧪 Testing

### Using Postman

Import the included `postman_collection.json` file into Postman.

### Manual Testing

1. Open two browser windows at `http://localhost:5173`
2. Create a card in one window
3. See it appear instantly in the other window
4. Edit/delete cards and observe real-time sync

### Test with curl

```bash
# Create a board
curl -X POST http://localhost:5000/api/boards \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Board", "defaultLists": true}'

# Create a task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"listId": "YOUR_LIST_ID", "name": "Test Task", "desc": "Description"}'

# Update a task
curl -X PUT http://localhost:5000/api/tasks/CARD_ID \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Task"}'

# Delete a task
curl -X DELETE http://localhost:5000/api/tasks/CARD_ID
```

## 🎥 Demo

See `demo-video.mp4` for a walkthrough of all features.

## 🔐 Security Notes

- Never commit `.env` file to version control
- The `.env` file contains sensitive API credentials
- In production, restrict CORS origins
- Regenerate Trello token if exposed

## 🛠️ Technologies Used

**Backend:**
- Node.js
- Express.js
- Socket.IO
- Axios
- dotenv

**Frontend:**
- React (Vite)
- Socket.IO Client
- Axios
- CSS3

## 📝 Assignment Requirements Checklist

- ✅ Four required API endpoints implemented and tested
- ✅ Real-time WebSocket integration
- ✅ Trello webhook support
- ✅ React frontend with boards/lists/cards
- ✅ Environment variables for security
- ✅ README with setup instructions
- ✅ Postman collection included
- ✅ Demo video showing real-time sync

## 🐛 Troubleshooting

**Backend not starting:**
- Check if `.env` file exists with valid credentials
- Ensure port 5000 is not in use

**Frontend not connecting:**
- Verify backend is running on port 5000
- Check browser console for errors

**Webhooks not working:**
- Ensure ngrok is running and URL is HTTPS
- Verify webhook is registered (check `/api/webhooks/list`)
- Check backend logs for incoming webhook events

## 👤 Author

Created for Internshala Trello Assignment

## 📄 License

MIT
