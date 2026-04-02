import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import Navbar from "./components/Navbar";
import Login from "./components/Login";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true; // send cookies automatically

function App() {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    axios
      .get("/api/notes")
      .then((res) => {
        setNotes(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load notes");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (darkMode) document.body.classList.add("dark");
    else document.body.classList.remove("dark");

    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      await axios.get("/api/auth/logout");
      localStorage.removeItem("user");
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  const addNote = async () => {
    if (user.role === "guest") {
      alert("Guests cannot add notes. Please login.");
      return;
    }
    if (!title || !content) {
      alert("Title and content are required");
      return;
    }

    try {
      if (editingId) {
        const res = await axios.put(`/api/notes/${editingId}`, { title, content });
        setNotes(notes.map((n) => (n._id === editingId ? res.data : n)));
        setEditingId(null);
      } else {
        const res = await axios.post("/api/notes", { title, content });
        setNotes([res.data, ...notes]);
      }

      setTitle("");
      setContent("");
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to save note");
    }
  };

  const deleteNote = async (note) => {
  if (user.role !== "admin" && user.username !== note.author) {
    alert("Only admin or the author can delete this note");
    return;
  }

  const confirmDelete = window.confirm("Delete this note?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`/api/notes/${note._id}`, {
      withCredentials: true  
    });

    setNotes(notes.filter((n) => n._id !== note._id));
  } catch (err) {
    console.error(err);
    alert("Failed to delete note");
  }
};

  const updateNote = (note) => {
    if (user.role === "guest") {
      alert("Login required to edit notes");
      return;
    }

    if (user.role !== "admin" && user.username !== note.author) {
      alert("You can only edit your own notes");
      return;
    }

    setTitle(note.title);
    setContent(note.content);
    setEditingId(note._id);
    setShowForm(true);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <h2>Loading notes...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <>
      {!user ? (
        <Login setUser={setUser} />
      ) : (
        <>
          <div className="user-header">
            <span>Welcome, {user.username}!</span>
            <button onClick={handleLogout}>Logout</button>
          </div>

          <Navbar
            count={filteredNotes.length}
            total={notes.length}
            toggleDarkMode={toggleDarkMode}
            darkMode={darkMode}
          />

          <div className={darkMode ? "App dark" : "App"}>
            {user.role !== "guest" && (
              <button
                className="add-note-btn"
                onClick={() => {
                  setShowForm(!showForm);
                  setEditingId(null);
                  setTitle("");
                  setContent("");
                }}
              >
                {showForm ? "Close" : "+ Add Note"}
              </button>
            )}

            {showForm && (
              <NoteForm
                title={title}
                setTitle={setTitle}
                content={content}
                setContent={setContent}
                addNote={addNote}
                editingId={editingId}
                noteToEdit={editingId ? notes.find(n => n._id === editingId) : null}
              />
            )}

            <div className="search-container">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {user.role === "admin" && (
              <div className="admin-panel">
                <h3>Admin Dashboard</h3>
                <p>Total Notes: {notes.length}</p>
              </div>
            )}

            <NoteList
              notes={filteredNotes}
              deleteNote={deleteNote}
              updateNote={updateNote}
              user={user}
            />
          </div>
        </>
      )}
    </>
  );
}

export default App;