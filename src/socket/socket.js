import { io } from "socket.io-client";

// Create and export a single socket instance
export const socket = io("http://localhost:8000");

// You can add additional event listeners here if needed
socket.on("connect", () => {
  console.log("Connected to Socket.IO server with ID:", socket.id);
});
