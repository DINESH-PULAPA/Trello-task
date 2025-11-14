// backend/routes/tasks.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

export default (io) => {
  const TRELLO_KEY = process.env.TRELLO_KEY;
  const TRELLO_TOKEN = process.env.TRELLO_TOKEN;

  // Get all cards for a list
  router.get("/list/:listId", async (req, res) => {
    const { listId } = req.params;
    try {
      const response = await axios.get(
        `https://api.trello.com/1/lists/${listId}/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`
      );
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error.response?.data || error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  // 1️⃣ Create a new task (card)
  router.post("/", async (req, res) => {
    const { listId, name, desc } = req.body;
    try {
      const response = await axios.post(
        `https://api.trello.com/1/cards?idList=${listId}&name=${encodeURIComponent(
          name
        )}&desc=${encodeURIComponent(
          desc
        )}&key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`
      );

      io.emit("taskCreated", response.data);
      res.json(response.data);
    } catch (error) {
      console.error("Error creating task:", error.response?.data || error);
      res.status(500).json({ error: "Failed to create task" });
    }
  });

  // 2️⃣ Update an existing task
  router.put("/:cardId", async (req, res) => {
    const { cardId } = req.params;
    const { name, desc, idList } = req.body;
    try {
      const response = await axios.put(
        `https://api.trello.com/1/cards/${cardId}?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`,
        { name, desc, idList }
      );

      io.emit("taskUpdated", response.data);
      res.json(response.data);
    } catch (error) {
      console.error("Error updating task:", error.response?.data || error);
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  // 3️⃣ Delete (close) a task
  router.delete("/:cardId", async (req, res) => {
    const { cardId } = req.params;
    try {
      const response = await axios.put(
        `https://api.trello.com/1/cards/${cardId}?closed=true&key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`
      );
      io.emit("taskDeleted", { cardId });
      res.json(response.data);
    } catch (error) {
      console.error("Error deleting task:", error.response?.data || error);
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  return router;
};
