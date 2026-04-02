const express = require("express");
const router = express.Router();
const { getNotes, createNote, updateNote, deleteNote } = require("../controllers/noteController");
const { isAuth } = require("../middleware/authMiddleware");

router.get("/", getNotes);

router.post("/", isAuth, createNote);
router.put("/:id", isAuth, updateNote);

router.delete("/:id", (req, res, next) => {
  next();
}, isAuth, deleteNote);

module.exports = router;