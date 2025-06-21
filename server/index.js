const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// --- Routes ---
app.use('/api/auth', authRoutes);   // Auth endpoints like /api/auth/login or /api/auth/register
app.use('/api/notes', noteRoutes);  // Notes endpoints like /api/notes/

// --- Health Check (Optional) ---
app.get('/', (req, res) => {
  res.send('🧠 Knowy AI Backend is running...');
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
