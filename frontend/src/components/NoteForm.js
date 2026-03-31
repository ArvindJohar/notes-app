import React, { useRef, useEffect } from "react";
import "./NoteForm.css";

function NoteForm({ title, setTitle, content, setContent, addNote, editingId, noteToEdit }) {
  const titleRef = useRef(null);

  useEffect(() => {
    if (editingId && noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);

      if (titleRef.current) {
        titleRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        titleRef.current.focus();
      }
    }
  }, [editingId, noteToEdit, setTitle, setContent]);

  return (
    <div className="note-form">
      <input
        ref={titleRef}
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <button className="submit-note-btn" onClick={addNote}>
        {editingId ? "Update Note" : "Add Note"}
      </button>
    </div>
  );
}

export default NoteForm;