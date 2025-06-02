import axios from 'axios';

const API = 'http://localhost:5000/api/notes';

export const saveNote = async (note) => {
  const res = await axios.post(API, note);
  return res.data;
};

export const fetchNotes = async () => {
  const res = await axios.get(API);
  return res.data;
};
