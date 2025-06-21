import axios from 'axios';

// --- Node.js backend (port 5000) ---
const API = axios.create({
  baseURL: 'http://localhost:5000',
});

// Automatically attach token to each request if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// 📌 NOTE routes (Node backend)
export const getNotes = () => API.get('/api/notes');
export const addNote = (note) => API.post('/api/notes', note);

// --- FastAPI Groq (port 8000) endpoints ---
export const askAI = (text) =>
  axios.post('http://localhost:8000/explain', { text });

export const classifySubject = async (text) => {
  try {
    const res = await axios.post('http://localhost:8000/classify-subject', { text });
    return res.data.answer || "Uncategorized";
  } catch (err) {
    console.error("Error classifying subject:", err);
    return "Uncategorized";
  }
};
