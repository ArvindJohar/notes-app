const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashed,
      role: "user"
    });

    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Wrong password" });
    }

    req.session.user = {
      id: user._id,
      username: user.username, 
      role: user.role
    };

    res.json(req.session.user);
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
};