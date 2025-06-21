import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Notes from './components/Notes';
import AIExplain from './components/AIExplain';
import Dashboard from './components/Dashboard';
import { getNotes } from './api';
import { jwtDecode } from 'jwt-decode';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [notes, setNotes] = useState([]);
  const user = token ? jwtDecode(token) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  useEffect(() => {
    const fetchNotes = async () => {
      const res = await getNotes();
      const cleanNotes = res.data.map(note => ({
        _id: note._id,
        title: note.title || '',
        subject: note.subject || '',
        text: note.text || '',
        tags: Array.isArray(note.tags) ? note.tags : [],
        score: note.score || 0
      }));
      setNotes(cleanNotes);
    };
    if (token) fetchNotes();
  }, [token]);

  if (!token) return <AuthForm onAuth={setToken} />;

  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1>Welcome, {user?.username}</h1>
          <nav>
            <Link to="/">Dashboard</Link> |{" "}
            <Link to="/notes">Notes</Link> |{" "}
            <Link to="/explain">Explain</Link> |{" "}
            <button onClick={handleLogout}>Logout</button>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Dashboard notes={notes} />} />
          <Route path="/notes" element={<Notes notes={notes} setNotes={setNotes} />} />
          <Route path="/explain" element={<AIExplain notes={notes} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
