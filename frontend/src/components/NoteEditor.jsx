import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const NoteEditor = ({ onSave }) => {
  const [title, setTitle] = useState('');

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
  });

  const handleSave = () => {
    if (!editor || !title) return;
    const content = editor.getHTML();
    onSave({ title, content });
    setTitle('');
    editor.commands.setContent('');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <input
        type="text"
        placeholder="Note Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: '100%',
          fontSize: '1.1rem',
          padding: '8px',
          marginBottom: '10px',
        }}
      />
      <div style={{ border: '1px solid #ccc', padding: '10px' }}>
        <EditorContent editor={editor} />
      </div>
      <button
        onClick={handleSave}
        style={{ marginTop: '10px', padding: '10px 20px' }}
      >
        Save Note
      </button>
    </div>
  );
};

export default NoteEditor;
