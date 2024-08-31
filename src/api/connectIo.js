import { io } from "socket.io-client";

function connectIo(userId) {
  // const socket = io("http://localhost:5000");
  const socket = io("https://api-hellotheatre.onrender.com");

  socket.on("connect", () => {
    console.log("Connected with socket ID:", socket.id);
    socket.emit("authenticate", { userId }); // Send user ID to the server
  });

  // Optionally handle other events
  socket.on("userStatusUpdate", (data) => {
    console.log(`User ${data.userId} is ${data.status}`);
    // Handle status updates, e.g., update the UI
  });

  return socket;
}

export default connectIo;
