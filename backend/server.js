require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");

const noteRoutes = require("./routes/noteRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// 🔥 VERY IMPORTANT (helps with session handling)
app.set("trust proxy", 1);

// ✅ CORS (must be BEFORE routes)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// ✅ JSON parser
app.use(express.json());

// ✅ SESSION (FIXED)
app.use(session({
  name: "connect.sid",
  secret: "secretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,       // HTTP (localhost)
    httpOnly: true,
    sameSite: "lax",     // 🔥 CRITICAL FIX
  },
}));

// 🔍 DEBUG (temporary — keep for now)
app.use((req, res, next) => {
  console.log("SESSION:", req.session);
  next();
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// ✅ MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));