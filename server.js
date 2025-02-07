const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Erlaubt die Verbindung vom React-Frontend
    methods: ["GET", "POST"],
  },
});

// Liste der verfügbaren Sounds
const sounds = [0, 1, 2, 3];
let currentIndex = 0;

io.on("connection", (socket) => {
  console.log("Ein Benutzer ist verbunden:", socket.id);

  // Weise jedem Benutzer einen Sound zu
  socket.emit("assignSound", sounds[currentIndex]);
  currentIndex = (currentIndex + 1) % sounds.length;

  socket.on("playSound", (sound) => {
    console.log(`Sound abgespielt: ${sound}`);
    io.emit("playSound", sound);
  });

  socket.on("disconnect", () => {
    console.log("Benutzer getrennt:", socket.id);
  });
});

// Starte den Server
server.listen(3001, () => console.log("Server läuft auf Port 3001"));
