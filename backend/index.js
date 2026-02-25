import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ✅ Schema
const noteSchema = new mongoose.Schema({
  title: String,
  description: String,
  x: Number,
  y: Number,
  pinned: Boolean,
  open: Boolean
});

const Note = mongoose.model("Note", noteSchema);

// ================= ROUTES =================

// Get all notes
app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// Create note
app.post("/notes", async (req, res) => {
  try {
    const newNote = await Note.create(req.body);
    res.json(newNote);
  } catch (err) {
    res.status(500).json({ error: "Failed to create note" });
  }
});

// Update note
app.put("/notes/:id", async (req, res) => {
  try {
    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update note" });
  }
});

// Delete note
app.delete("/notes/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note" });
  }
});

// ✅ IMPORTANT FOR RENDER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));