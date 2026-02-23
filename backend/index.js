const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const Note = require("./model/todo");

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 MongoDB Connection
mongoose.connect("mongodb+srv://DharaniselviMoorthi:dharani31@cluster0.v2jzapg.mongodb.net/notesDB?appName=Cluster0")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


// Create
app.post("/notes", async (req, res) => {
    try {
        const newNote = new Note(req.body);
        await newNote.save();
        res.status(201).json(newNote);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Read
app.get("/notes", async (req, res) => {
    const notes = await Note.find();
    res.json(notes);
});

// Update
app.put("/notes/:id", async (req, res) => {
    const updated = await Note.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(updated);
});

// Delete
app.delete("/notes/:id", async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port");
});