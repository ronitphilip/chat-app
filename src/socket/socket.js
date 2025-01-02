import { io } from "socket.io-client";
import { baseURL } from "../redux/serverURL";

// Create and export a single socket instance
export const socket = io(baseURL);

// You can add additional event listeners here if needed
socket.on("connect", () => {
  console.log("Connected to Socket.IO server with ID:", socket.id);
});
