import { io } from "socket.io-client";

// const socket = io("http://localhost:5000");
const socket = io("https://api-hellotheatre.onrender.com");

socket.on("connect", () => {
  // console.log("Connected with socket ID:", socket.id);
});

export default socket;
