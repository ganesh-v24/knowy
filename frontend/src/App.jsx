import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupForm from './pages/SignupForm';
import NotesPage from './pages/NotesPage'; // Add this import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/notes" element={<NotesPage />} /> {/* New route */}
      </Routes>
    </Router>
  );
}

export default App;
