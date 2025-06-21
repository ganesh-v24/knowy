import { useEffect, useState } from 'react';
import { getNotes, addNote } from '../api';
import axios from 'axios'; // 🔁 Added for subject classification API call
import './Notes.css'; 

export default function Notes({ notes, setNotes }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [tags, setTags] = useState([]);
  const [text, setText] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [filter, setFilter] = useState('');

  const fetchNotes = async () => {
    const res = await getNotes();
    const cleanNotes = res.data.map(note => ({
      _id: note._id,
      title: note.title || '',
      subject: note.subject || '',
      text: note.text || '',
      tags: Array.isArray(note.tags) ? note.tags : []
    }));
    setNotes(cleanNotes);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    if (!text.trim()) return;

    let finalSubject = subject;

    // 🔍 Auto-classify subject if blank
    if (!finalSubject.trim()) {
      try {
        const response = await axios.post('http://localhost:8000/classify-subject', { text });
        finalSubject = response.data.answer || "Uncategorized";
        setSubject(finalSubject); // Optionally reflect this to user
      } catch (error) {
        console.error("Subject classification failed:", error);
        finalSubject = "Uncategorized";
      }
    }

    await addNote({ title, subject: finalSubject, tags, text });

    // Reset all fields
    setTitle('');
    setSubject('');
    setTags([]);
    setText('');
    setTagInput('');
    fetchNotes();
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const filteredNotes = notes.filter((note) => {
    const keyword = filter.toLowerCase();
    return (
      note.title.toLowerCase().includes(keyword) ||
      note.subject.toLowerCase().includes(keyword) ||
      note.text.toLowerCase().includes(keyword) ||
      note.tags.some((tag) => tag.toLowerCase().includes(keyword))
    );
  });

  return (
    <div className="note-container">
      <h2>Create Note</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <form onSubmit={handleAddTag} className="tag-form">
        <input
          type="text"
          placeholder="Add tag"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
        />
        <button type="submit">Add Tag</button>
      </form>
      <div className="tag-list">
        {tags.map((tag) => (
          <span key={tag} className="note-tag">
            {tag} <button onClick={() => handleRemoveTag(tag)}>×</button>
          </span>
        ))}
      </div>
      <textarea
        rows="4"
        placeholder="Your note here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleAddNote}>Save Note</button>

      <hr />

      <input
        type="text"
        placeholder="Search notes..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <h2>Your Notes</h2>
      {filteredNotes.map((note) => (
        <div key={note._id} className="note-card">
          <h3>{note.title}</h3>
          <p><strong>Subject:</strong> {note.subject}</p>
          <p><strong>Tags:</strong> {note.tags.join(', ')}</p>
          <p>{note.text}</p>
        </div>
      ))}
    </div>
  );
}
