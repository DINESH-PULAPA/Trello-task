// backend/routes/boards.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

export default (io) => {
  const TRELLO_KEY = process.env.TRELLO_KEY;
  const TRELLO_TOKEN = process.env.TRELLO_TOKEN;

  // Get all boards
  router.get("/", async (req, res) => {
    try {
      const response = await axios.get(
        `https://api.trello.com/1/members/me/boards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`
      );
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching boards:", error.response?.data || error);
      res.status(500).json({ error: "Failed to fetch boards" });
    }
  });

  // Get lists for a board
  router.get("/:boardId/lists", async (req, res) => {
    const { boardId } = req.params;
    try {
      const response = await axios.get(
        `https://api.trello.com/1/boards/${boardId}/lists?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`
      );
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching lists:", error.response?.data || error);
      res.status(500).json({ error: "Failed to fetch lists" });
    }
  });

  // 4️⃣ Create a new Trello board
  router.post("/", async (req, res) => {
    const { name, defaultLists } = req.body;
    try {
      const response = await axios.post(
        `https://api.trello.com/1/boards/?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`,
        { name, defaultLists }
      );

      io.emit("boardCreated", response.data);
      res.json(response.data);
    } catch (error) {
      console.error("Error creating board:", error.response?.data || error);
      res.status(500).json({ error: "Failed to create board" });
    }
  });

  // Delete a board
  router.delete("/:boardId", async (req, res) => {
    const { boardId } = req.params;
    try {
      await axios.delete(
        `https://api.trello.com/1/boards/${boardId}?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`
      );

      io.emit("boardDeleted", { boardId });
      res.json({ success: true, boardId });
    } catch (error) {
      console.error("Error deleting board:", error.response?.data || error);
      res.status(500).json({ error: "Failed to delete board" });
    }
  });

  return router;
};
