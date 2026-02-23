const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Note = require("./model/todo");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://DharaniselviMoorthi:dharani31@cluster0.v2jzapg.mongodb.net/notesDB?appName=Cluster0")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.post("/notes", async (req, res) => {
    const note = new Note(req.body);
    await note.save();
    res.json(note);
});

app.get("/notes", async (req, res) => {
    const notes = await Note.find();
    res.json(notes);
});

app.put("/notes/:id", async (req, res) => {
    const updated = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

app.delete("/notes/:id", async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));