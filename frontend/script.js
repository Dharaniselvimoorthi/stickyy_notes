const API = "http://localhost:3000/notes";

async function fetchNotes() {
    const res = await fetch(API);
    const data = await res.json();

    const container = document.getElementById("notesContainer");
    container.innerHTML = "";

    data.reverse().forEach(note => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.description}</p>
            <button onclick="deleteNote('${note._id}', this)">Delete</button>
            <button onclick="editNote('${note._id}','${note.title}','${note.description}')">Edit</button>
        `;
        container.appendChild(card);
    });
}

async function addNote() {
    const title = document.getElementById("title");
    const description = document.getElementById("description");

    if (title.value === "" || description.value === "") {
        alert("Please fill all fields");
        return;
    }

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: title.value,
            description: description.value
        })
    });

    title.value = "";
    description.value = "";

    fetchNotes();
}

async function deleteNote(id, btn) {
    btn.parentElement.style.transform = "scale(0)";
    btn.parentElement.style.opacity = "0";

    setTimeout(async () => {
        await fetch(`${API}/${id}`, { method: "DELETE" });
        fetchNotes();
    }, 300);
}

async function editNote(id, oldTitle, oldDesc) {
    const title = prompt("Edit Title", oldTitle);
    const description = prompt("Edit Description", oldDesc);

    if (!title || !description) return;

    await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
    });

    fetchNotes();
}

window.onload = fetchNotes;