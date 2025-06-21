const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const auth = require('../middleware/auth');

// ✅ CREATE note (POST /api/notes)
router.post('/', auth, async (req, res) => {
  try {
    const { title, text, subject, tags } = req.body;

    if (!title || !text || !subject) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newNote = new Note({
      title,
      text,
      subject,
      tags,
      user: req.userId
    });

    const saved = await newNote.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating note:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET notes for current user (GET /api/notes)
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch notes' });
  }
});

module.exports = router;
