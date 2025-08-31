import React, { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../App';
import {  WifiIcon, SignalIcon, LucideBatteryFull } from "lucide-react";
import Clock from '../components/Clock';
import { useNavigate } from 'react-router-dom';


export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const resp = await API.get('/notes');
        setNotes(resp.data);
      } catch (err) {
        alert('Could not load notes');
      }
    };
    fetchNotes();
  }, []);

  const createNote = async () => {
    if (!title.trim() || !content.trim()) {
      setMessage(" Title and content cannot be empty");
      return;
    }
    try {
      const res = await API.post('/notes', { title, content });
      setNotes(prev => [res.data, ...prev]);
      setTitle('');
      setContent('');
      setMessage(" Note created successfully!");
      setShowForm(false);
    } catch (err) {
      setMessage(err.response?.data?.error || ' Create note failed');
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm('Delete note?')) return;
    try {
      await API.delete(`/notes/${id}`);
      setNotes(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
     navigate('/login', { replace: true })
  };

  return (
    <div className="min-h-screen bg-white relative">
      <div className="w-full  h-[44px] flex justify-between items-center px-4">
        <span className="text-[14px] px-3 font-medium text-gray-900">  <Clock /></span>

        <div className="flex items-center object-contain space-x-2">
          <SignalIcon className="w-5 h-5 object-contain" />

          <WifiIcon className="w-5 h-5 object-contain" />
          <LucideBatteryFull className="w-6 h-6 object-contain" />
        </div>
      </div>
      <header className=" ">
        <div className="flex justify-between items-center px-4 py-3">
          <img src="/top.jpg" alt="" className="h-8 w-auto bg-transparent object-contain" />
          <h1 className="text-lg font-medium text-gray-800 absolute  left-[70px] w-[129px] h-[22px] 
          font-inter  text-[20px] leading-[110%] tracking-[-0.04em] 
           text-center opacity-100">Dashboard</h1>
          <button
            onClick={logout}
            className="text-blue-500 underline text-sm font-normal"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        <div className="w-full p-4 bg-white border border-[#D9D9D9] rounded-[10px] shadow-[0px_2px_6px_rgba(0,0,0,0.59)]">
          <h1 className="text-lg font-extrabold mb-2">
            Welcome, {user?.name}
          </h1>
          <p className="text-base">Email: {user?.email}</p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full h-[52px] bg-blue-500 text-white text-base font-semibold rounded-[10px] hover:bg-blue-700 transition"
        >
          {showForm ? "Cancel" : "Create Note"}
        </button>

        {showForm && (
          <div className="w-full p-4 bg-white border rounded-lg shadow space-y-3">
            <h2 className="text-lg font-semibold">Create a Note</h2>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:outline-none"
            />
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your note..."
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={createNote}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Save Note
            </button>
            {message && (
              <p className="mt-2 text-sm text-gray-600">{message}</p>
            )}
          </div>
        )}

        <div>
          <h2 className="font-medium text-[20px] mb-3 text-gray-900">Notes</h2>
          <div className="space-y-3">
            {notes.map(n => (
              <div
                key={n._id}
                className="w-full p-4 rounded-[10px] border border-[#D9D9D9] shadow-[0_2px_6px_#00000096] flex justify-between items-center bg-white"
              >
                <div>
                  <h3 className="font-medium text-gray-800">{n.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{n.content}</p>
                </div>
                <button
                  onClick={() => deleteNote(n._id)}
                  className="p-2 rounded-full transition transform hover:scale-110 active:scale-95 hover:black"
                >
                  <img
                    src="/delete.png"
                    alt="Delete"
                    className="w-6 h-6 object-contain"
                  />
                </button>
              </div>
            ))}
            {notes.length === 0 && (
              <p className="text-gray-500 text-center">
                No notes yet. Start by creating one!
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
