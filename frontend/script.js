const API = "https://stickyy-note.onrender.com/notes";

const colors = [
    "#fdf6b2",
    "#ffd6e0",
    "#d0f4de",
    "#cdb4db",
    "#a0c4ff"
];

async function fetchNotes() {
    const res = await fetch(API);
    const data = await res.json();
    const container = document.getElementById("notesContainer");
    container.innerHTML = "";

    data.reverse().forEach(note => {
        createCard(note);
    });
}

function randomPosition() {
    return Math.floor(Math.random() * 60) + 10;
}

function createCard(note) {
    const container = document.getElementById("notesContainer");

    const card = document.createElement("div");
    card.className = "card";
    card.style.background = colors[Math.floor(Math.random() * colors.length)];
    card.style.top = randomPosition() + "%";
    card.style.left = randomPosition() + "%";

    card.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.description}</p>
        <button onclick="deleteNote('${note._id}', this)">🗑</button>
        <button onclick="editNote('${note._id}','${note.title}','${note.description}')">✏</button>
    `;

    card.addEventListener("click", () => {
        card.classList.toggle("open");
    });

    dragElement(card);
    container.appendChild(card);
}

function dragElement(elmnt) {
    let pos1=0,pos2=0,pos3=0,pos4=0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDrag;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDrag() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

async function addNote() {
    const title = document.getElementById("title");
    const description = document.getElementById("description");

    if (!title.value || !description.value) return;

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: title.value,
            description: description.value
        })
    });

    confetti();
    title.value = "";
    description.value = "";
    fetchNotes();
}

function confetti() {
    for (let i=0;i<50;i++){
        const div=document.createElement("div");
        div.style.position="fixed";
        div.style.width="10px";
        div.style.height="10px";
        div.style.background=colors[Math.floor(Math.random()*colors.length)];
        div.style.top="0";
        div.style.left=Math.random()*100+"%";
        div.style.opacity="0.8";
        div.style.zIndex="9999";
        div.style.borderRadius="50%";
        div.style.transition="1.5s";
        document.body.appendChild(div);
        setTimeout(()=>{
            div.style.top="100%";
            div.style.transform="rotate(720deg)";
            div.style.opacity="0";
        },10);
        setTimeout(()=>div.remove(),1500);
    }
}

async function deleteNote(id, btn) {
    const card = btn.parentElement;
    card.classList.add("delete");

    setTimeout(async () => {
        await fetch(`${API}/${id}`, { method: "DELETE" });
        fetchNotes();
    }, 400);
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