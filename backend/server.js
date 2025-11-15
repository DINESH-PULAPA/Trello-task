// backend/server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import tasksRouter from "./routes/tasks.js";
import boardsRouter from "./routes/boards.js";
import webhooksRouter from "./routes/webhooks.js";


dotenv.config();

// Validate required environment variables
if (!process.env.TRELLO_KEY || !process.env.TRELLO_TOKEN) {
  console.error("❌ Missing TRELLO_KEY or TRELLO_TOKEN in .env file");
  process.exit(1);
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow all for development; restrict in production
  },
});

app.use(cors());
app.use(bodyParser.json());

// Register routes
app.use("/api/tasks", tasksRouter(io));
app.use("/api/boards", boardsRouter(io));
app.use("/api/webhooks", webhooksRouter);



// Socket.IO connection setup
io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Temporary root route (for testing)
app.get("/", (req, res) => {
  res.send("Trello Backend Running 🚀");
});

// Trello Webhook endpoint - Trello will send events here
app.post("/webhook", (req, res) => {
  console.log("📡 Webhook event received:", JSON.stringify(req.body, null, 2));
  
  const event = req.body;
  const action = event.action;
  
  // Normalize and broadcast Trello events to all connected clients
  if (action) {
    const eventType = action.type;
    
    // Map Trello event types to our app events
    if (eventType === 'createCard') {
      io.emit('taskCreated', action.data.card);
    } else if (eventType === 'updateCard') {
      io.emit('taskUpdated', action.data.card);
    } else if (eventType === 'deleteCard') {
      io.emit('taskDeleted', { cardId: action.data.card.id });
    } else if (eventType === 'createBoard') {
      io.emit('boardCreated', action.data.board);
    }
    
    // Also send raw event for debugging
    io.emit('trelloUpdate', event);
  }
  
  res.sendStatus(200);
});

// Trello Webhook verification (Trello checks this when creating webhook)
app.head("/webhook", (req, res) => {
  console.log("✅ Webhook HEAD verification");
  res.sendStatus(200);
});

app.get("/webhook", (req, res) => {
  console.log("✅ Webhook GET verification:", req.query);
  res.send(req.query["challenge"] || "Webhook verified");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
