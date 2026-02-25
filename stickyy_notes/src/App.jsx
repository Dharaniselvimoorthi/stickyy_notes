import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState([]);
  const [editId, setEditId] = useState(null);
  const spotlightRef = useRef(null);
  const boardRef = useRef(null);

  const API_URL = "https://stickyy-note.onrender.com/notes";

  // LOAD NOTES
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(err => console.log(err));
  }, []);

  // SPOTLIGHT
  useEffect(() => {
    const move = (e) => {
      if (!spotlightRef.current) return;
      spotlightRef.current.style.background = `
        radial-gradient(circle 180px at ${e.clientX}px ${e.clientY}px,
        rgba(255,220,120,0.12), transparent 70%)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // ADD / UPDATE NOTE
  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return;

    if (editId) {
      // update UI immediately
      setNotes(prev =>
        prev.map(n =>
          n._id === editId ? { ...n, title, description } : n
        )
      );

      fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
      });

      setEditId(null);
    } else {
      const newNote = {
        title,
        description,
        x: 150,
        y: 150,
        open: false,
        pinned: false
      };

      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote)
      })
        .then(res => res.json())
        .then(created => {
          setNotes(prev => [...prev, created]);
        });
    }

    setTitle("");
    setDescription("");
  };

  // TOGGLE PIN
  const togglePin = (id) => {
    setNotes(prev =>
      prev.map(n =>
        n._id === id ? { ...n, pinned: !n.pinned } : n
      )
    );

    const note = notes.find(n => n._id === id);

    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: !note.pinned })
    });
  };

  // TOGGLE OPEN (Reveal Secret + Flip)
  const toggleOpen = (id) => {
    setNotes(prev =>
      prev.map(n =>
        n._id === id ? { ...n, open: !n.open } : n
      )
    );

    const note = notes.find(n => n._id === id);

    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ open: !note.open })
    });
  };

  // DELETE NOTE
  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n._id !== id));

    fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });
  };

  // EDIT
  const editNote = (note) => {
    setTitle(note.title);
    setDescription(note.description);
    setEditId(note._id);
  };

  // DRAG
  const handleDragStart = (e, id) => {
    e.preventDefault();
    const card = e.currentTarget;

    const boardRect = boardRef.current.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    const shiftX = e.clientX - cardRect.left;
    const shiftY = e.clientY - cardRect.top;

    const onMouseMove = (e) => {
      const newX = e.clientX - boardRect.left - shiftX;
      const newY = e.clientY - boardRect.top - shiftY;

      card.style.left = `${newX}px`;
      card.style.top = `${newY}px`;
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      const x = parseInt(card.style.left);
      const y = parseInt(card.style.top);

      setNotes(prev =>
        prev.map(n =>
          n._id === id ? { ...n, x, y } : n
        )
      );

      fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x, y })
      });
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="dust">
      <div className="spotlight" ref={spotlightRef}></div>

      <h1 className="title">🕯 Midnight Secret Board</h1>

      <div className="form">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Secret Title..."
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write your hidden memory..."
        />
        <button onClick={handleSubmit}>
          {editId ? "Update Memory ✏" : "Seal Memory"}
        </button>
      </div>

      <div className="notes" ref={boardRef}>
        {notes.map(note => (
          <div
            key={note._id}
            className={`card ${note.open ? "open" : ""} ${note.pinned ? "pinned" : ""}`}
            style={{ left: note.x, top: note.y }}
            onMouseDown={(e) => handleDragStart(e, note._id)}
            onClick={() => toggleOpen(note._id)}
          >
            <h3>{note.title}</h3>
            <p>{note.description}</p>

            <div className="btn-group">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  editNote(note);
                }}
              >
                Edit
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePin(note._id);
                }}
              >
                📌
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note._id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;