const Note = require("../models/Note");

// GET all notes
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load notes" });
  }
};

// CREATE note
const createNote = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.status(401).json({ error: "Login required" });

    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content required" });
    }

    const note = await Note.create({
      title,
      content,
      author: user.username,
    });

    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save note" });
  }
};

// UPDATE note
const updateNote = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.status(401).json({ error: "Login required" });

    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    if (user.role !== "admin" && note.author !== user.username) {
      return res.status(403).json({ error: "Not allowed" });
    }

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;

    const updated = await note.save();
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update note" });
  }
};

// DELETE note (admin OR author)
const deleteNote = async (req, res) => {
  try {
    console.log("SESSION USER:", req.session.user); // debug

    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    const user = req.session.user;
    if (!user) return res.status(401).json({ error: "Login required" });

    if (user.role !== "admin" && note.author !== user.username) {
      return res.status(403).json({ error: "Not allowed" });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete note" });
  }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };