import React, { useEffect, useState } from 'react';
import NoteEditor from '../components/NoteEditor';
import { fetchNotes, saveNote } from '../services/noteService';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);

  const loadNotes = async () => {
    const res = await fetchNotes();
    setNotes(res);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleSave = async (note) => {
    await saveNote(note);
    loadNotes();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📝 Knowy - Notes</h1>
      <NoteEditor onSave={handleSave} />
      <h2>📚 Saved Notes</h2>
      {notes.map((note) => (
        <div key={note._id} style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ddd' }}>
          <h3>{note.title}</h3>
          <div dangerouslySetInnerHTML={{ __html: note.content }} />
        </div>
      ))}
    </div>
  );
};

export default NotesPage;
