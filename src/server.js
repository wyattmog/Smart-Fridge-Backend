require("dotenv").config();
const express = require('express');
const app = express();
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, try again later." }
});

app.use(globalLimiter);
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ["http://localhost:3000"];
    const emulatorPattern = /^http:\/\/10\.0\.2\.2:\d+$/;
    
    if (!origin || allowedOrigins.includes(origin) || emulatorPattern.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: "10kb" }));

const recipeRoutes = require('./routes/recipeRoutes.js');
const sessionRoutes = require('./routes/sessionRoutes');

app.use('/api/recipes', recipeRoutes);
app.use('/api/sessions', sessionRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
// In production (Docker/Cloud), binding to 0.0.0.0 is often required.
// Default to 127.0.0.1 for local dev safety, but allow override.
const HOST = process.env.HOST || "127.0.0.1";

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
