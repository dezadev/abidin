const contacts = [
  {
    id: 1,
    name: "Budi",
    status: "Terakhir dilihat 10:32",
    messages: [
      { from: "received", text: "Halo, jadi rapat jam berapa?", time: "09:15" },
      { from: "sent", text: "Jam 10:00 ya, di ruang A.", time: "09:17" }
    ]
  },
  {
    id: 2,
    name: "Sari",
    status: "Online",
    messages: [
      { from: "received", text: "Tolong kirim file desain terbaru.", time: "08:02" },
      { from: "sent", text: "Siap, aku kirim sekarang.", time: "08:04" }
    ]
  },
  {
    id: 3,
    name: "Tim Proyek",
    status: "32 anggota",
    messages: [
      { from: "received", text: "Standup dimulai 5 menit lagi.", time: "07:55" }
    ]
  }
];

const STORAGE_KEY = "chatapp_messages";
let activeContactId = contacts[0].id;

const contactListEl = document.getElementById("contactList");
const chatHeaderEl = document.getElementById("chatHeader");
const chatMessagesEl = document.getElementById("chatMessages");
const chatFormEl = document.getElementById("chatForm");
const messageInputEl = document.getElementById("messageInput");
const contactSearchEl = document.getElementById("contactSearch");

function nowTime() {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
}

function saveMessages() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

function loadMessages() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;

  const parsed = JSON.parse(stored);
  parsed.forEach((savedContact) => {
    const contact = contacts.find((c) => c.id === savedContact.id);
    if (contact) {
      contact.messages = savedContact.messages;
    }
  });
}

function renderContacts(filter = "") {
  contactListEl.innerHTML = "";
  const normalizedFilter = filter.trim().toLowerCase();

  contacts
    .filter((contact) => contact.name.toLowerCase().includes(normalizedFilter))
    .forEach((contact) => {
      const lastMessage = contact.messages[contact.messages.length - 1];
      const item = document.createElement("li");
      item.className = `contact-item ${contact.id === activeContactId ? "active" : ""}`;
      item.innerHTML = `
        <div class="contact-meta">
          <strong>${contact.name}</strong>
          <span>${lastMessage ? lastMessage.text.slice(0, 28) : "Belum ada pesan"}</span>
        </div>
        <small>${lastMessage ? lastMessage.time : ""}</small>
      `;

      item.addEventListener("click", () => {
        activeContactId = contact.id;
        renderContacts(contactSearchEl.value);
        renderChat();
      });

      contactListEl.appendChild(item);
    });
}

function renderChat() {
  const contact = contacts.find((c) => c.id === activeContactId);
  if (!contact) return;

  chatHeaderEl.innerHTML = `<h2>${contact.name}</h2><p>${contact.status}</p>`;
  chatMessagesEl.innerHTML = "";

  contact.messages.forEach((message) => {
    const bubble = document.createElement("article");
    bubble.className = `message ${message.from}`;
    bubble.innerHTML = `${message.text}<span class="time">${message.time}</span>`;
    chatMessagesEl.appendChild(bubble);
  });

  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

function sendMessage(text) {
  const contact = contacts.find((c) => c.id === activeContactId);
  if (!contact) return;

  contact.messages.push({
    from: "sent",
    text,
    time: nowTime()
  });

  saveMessages();
  renderContacts(contactSearchEl.value);
  renderChat();

  setTimeout(() => {
    contact.messages.push({
      from: "received",
      text: "Pesan diterima 👍",
      time: nowTime()
    });
    saveMessages();
    renderContacts(contactSearchEl.value);
    renderChat();
  }, 600);
}

chatFormEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = messageInputEl.value.trim();
  if (!text) return;

  sendMessage(text);
  messageInputEl.value = "";
  messageInputEl.focus();
});

contactSearchEl.addEventListener("input", (event) => {
  renderContacts(event.target.value);
});

loadMessages();
renderContacts();
renderChat();
