const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  subject: { type: String, required: true },
  tags: [String],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true
});

// Full-text search index
NoteSchema.index({ title: 'text', text: 'text', subject: 'text' });

module.exports = mongoose.model('Note', NoteSchema);
