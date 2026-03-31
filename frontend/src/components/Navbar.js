function Navbar({ count, total, toggleDarkMode, darkMode }) {
  return (
    <div className="navbar">
      <h2>My Notes ({count}/{total})</h2>

      <button className="dark-toggle" onClick={toggleDarkMode}>
        {darkMode ? "☀" : "🌙"}
      </button>
    </div>
  );
}

export default Navbar;