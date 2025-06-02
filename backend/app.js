const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

mongoose.connect('mongodb://localhost:27017/knowy_notes', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// Auth routes (signup, login)
app.use('/api', require('./routes/auth'));

// Notes routes
app.use('/api/notes', require('./routes/notes'));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
