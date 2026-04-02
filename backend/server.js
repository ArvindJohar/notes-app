require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");

const noteRoutes = require("./routes/noteRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.set("trust proxy", 1);

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

app.use(session({
  name: "connect.sid",
  secret: "secretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,       
    httpOnly: true,
    sameSite: "lax",     
  },
}));

app.use((req, res, next) => {
  console.log("SESSION:", req.session);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));