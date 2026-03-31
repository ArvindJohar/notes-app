import React from "react";

function NoteList({ notes, deleteNote, updateNote, user }) {
  if (!notes.length) return <p>No notes available</p>;

  return (
    <div className="note-list">
      {notes.map((note) => (
        <div key={note._id} className="note-card">
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <small>By: {note.author}</small>
          {user.role === "admin" && (
            <small style={{ color: "gray" }}>
              ID: {note._id}
            </small>
          )}
          <div className="note-actions">
            {(user.role === "admin" || user.username === note.author) && (
              <>
                <button className="edit-btn" onClick={() => updateNote(note)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteNote(note)}>Delete</button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default NoteList;