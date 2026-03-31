const express = require("express");
const router = express.Router();
const { getNotes, createNote, updateNote, deleteNote } = require("../controllers/noteController");
const { isAuth } = require("../middleware/authMiddleware");

// Public
router.get("/", getNotes);

// Authenticated users
router.post("/", isAuth, createNote);
router.put("/:id", isAuth, updateNote);

// Admin only
router.delete("/:id", (req, res, next) => {
  console.log("🔥 DELETE ROUTE HIT");
  next();
}, isAuth, deleteNote);

module.exports = router;