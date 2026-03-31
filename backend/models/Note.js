const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true }, // username of creator from session
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", NoteSchema);