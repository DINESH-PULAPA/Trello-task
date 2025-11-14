// backend/routes/webhooks.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;

// Create a webhook for a board
router.post("/create", async (req, res) => {
  const { boardId, callbackURL } = req.body;
  
  if (!callbackURL) {
    return res.status(400).json({ error: "callbackURL is required (e.g., https://your-ngrok-url.ngrok.io/webhook)" });
  }
  
  try {
    const response = await axios.post(
      `https://api.trello.com/1/webhooks?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`,
      {
        description: "Trello Board Webhook",
        callbackURL: callbackURL,
        idModel: boardId
      }
    );
    
    console.log("✅ Webhook created:", response.data);
    res.json({ 
      success: true, 
      webhook: response.data,
      message: "Webhook registered successfully. Trello will now send events to: " + callbackURL
    });
  } catch (error) {
    console.error("Error creating webhook:", error.response?.data || error);
    res.status(500).json({ 
      error: "Failed to create webhook",
      details: error.response?.data || error.message
    });
  }
});

// List all webhooks
router.get("/list", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.trello.com/1/tokens/${TRELLO_TOKEN}/webhooks?key=${TRELLO_KEY}`
    );
    
    res.json(response.data);
  } catch (error) {
    console.error("Error listing webhooks:", error.response?.data || error);
    res.status(500).json({ error: "Failed to list webhooks" });
  }
});

// Delete a webhook
router.delete("/:webhookId", async (req, res) => {
  const { webhookId } = req.params;
  
  try {
    await axios.delete(
      `https://api.trello.com/1/webhooks/${webhookId}?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`
    );
    
    res.json({ success: true, message: "Webhook deleted" });
  } catch (error) {
    console.error("Error deleting webhook:", error.response?.data || error);
    res.status(500).json({ error: "Failed to delete webhook" });
  }
});

export default router;
