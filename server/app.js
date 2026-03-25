require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const connectDB = require('./config/db');
const profileRoutes = require('./routes/profileRoutes');
const errorHandler = require('./middleware/errorHandler');
const Report = require('./models/Report');

const app = express();

// ─── Connect Database ────────────────────────────────────────────────────────
connectDB();

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/compare', async (req, res, next) => {
  const { u1, u2 } = req.query;
  req.query = { u1, u2 };
  next();
}, require('./controllers/profileController').compareProfiles);

app.use('/api/profile', profileRoutes);

// ─── Error Handler ───────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Scheduled Cache Cleanup (every hour) ───────────────────────────────────
cron.schedule('0 * * * *', async () => {
  const deleted = await Report.deleteMany({ expiresAt: { $lt: new Date() } });
  if (deleted.deletedCount > 0) {
    // Cache cleanup ran silently
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  // Server running
});

module.exports = app;
