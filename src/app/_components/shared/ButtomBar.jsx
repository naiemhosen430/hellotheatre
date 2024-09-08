"use client";
import React, { useContext, useState, useRef, useEffect } from "react";
import { Container } from "react-bootstrap";
import { AuthContex } from "@/Contexts/AuthContex";
import connectIo from "@/api/connectIo";
import MyRoom from "../rooms/MyRoom";

export default function BottomBar({ roomName }) {
  const socket = connectIo();
  const { state } = useContext(AuthContex);
  const userData = state?.user;
  const [joinState, setJoinState] = useState(false);
  const [roomUserName, setRoomUserName] = useState("");
  const [joined, setJoined] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [joinedMyRoomState, setJoinedMyRoomState] = useState(false);
  const [stream, setStream] = useState(null);

  const peersRef = useRef({});

  // Create room (Host)
  const createRoom = () => {
    if (userData?.username) {
      socket.emit("create-room", userData?.username);
    }
  };

  useEffect(() => {
    // Host creates a room and starts sharing
    socket.on("room-created", () => {
      startSharing();
      setJoinedMyRoomState(true);
    });

    // Notify host when a user joins the room
    socket.on("user-joined", (userId) => {
      console.log(`User joined: ${userId}`);
      createPeer(userId, true); // Host creates peer connection with viewer
    });

    // Signal handling for WebRTC connection
    socket.on("signal", ({ signal, id }) => {
      console.log("Received signal from viewer");
      const peer = peersRef.current[id];
      if (peer) {
        peer.signal(signal);
      }
    });

    return () => {
      socket.off("room-created");
      socket.off("user-joined");
      socket.off("signal");
    };
  }, [stream]);

  // Host starts sharing the screen
  const startSharing = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      setStream(displayStream);

      // Show the host's stream locally
      const video = document.createElement("video");
      video.srcObject = displayStream;
      video.muted = true;
      video.play();
      document.body.appendChild(video);

      // Initialize peer connections for each user
      Object.keys(peersRef.current).forEach((userId) => {
        createPeer(userId, true); // Initiator = true for host
      });
    } catch (err) {
      console.error("Error starting display sharing: ", err);
    }
  };

  const createPeer = (userId, initiator = false) => {
    const peer = new SimplePeer({
      initiator,
      trickle: false,
      stream: initiator ? stream : null, // Host sends stream, viewer receives
    });

    peer.on("signal", (signal) => {
      console.log("Sending signal to server");
      socket.emit("signal", {
        signal,
        username: userData?.username,
        id: userId,
      });
    });

    peer.on("stream", (remoteStream) => {
      console.log("Received remote stream from host");
      const remoteVideo = document.getElementById("remoteVideo");
      if (remoteVideo) {
        remoteVideo.srcObject = remoteStream;
        remoteVideo.play();
      }
    });

    peersRef.current[userId] = peer;
  };

  // Viewer joins the room
  const handleJoin = async (event) => {
    event.preventDefault();

    socket.emit("join-room", { username: roomUserName });

    socket.on("joined-room", () => {
      console.log("Successfully joined room");
      setJoined(true); // Viewer has joined
    });

    socket.on("roomNotFound", () => {
      setStatusMessage("Room not available.");
    });

    // Handle WebRTC signaling
    socket.on("signal", ({ signal, id }) => {
      console.log("Received signal from host");
      const peer = peersRef.current[id];
      if (peer) {
        peer.signal(signal);
      } else {
        console.warn("Peer not found for signaling");
      }
    });

    const createPeer = (userId, initiator = false) => {
      const peer = new SimplePeer({
        initiator, // Viewer is not initiator
        trickle: false,
      });

      peer.on("signal", (signal) => {
        console.log("Sending signal to server");
        socket.emit("signal", {
          signal,
          username: userData?.username,
          id: userId,
        });
      });

      peer.on("stream", (remoteStream) => {
        console.log("Received remote stream from host");
        const remoteVideo = document.getElementById("remoteVideo");
        if (remoteVideo) {
          remoteVideo.srcObject = remoteStream;
          remoteVideo.play();
        }
      });

      peersRef.current[userId] = peer;
    };
  };

  return (
    <>
      {joinedMyRoomState && (
        <MyRoom setJoinedMyRoomState={setJoinedMyRoomState} />
      )}
      {joined ? (
        <div className="fixed h-screen w-screen flex items-center justify-center z-50 top-0 left-0 bg-black">
          <video
            id="remoteVideo"
            autoPlay
            className="w-full h-full"
            style={{ backgroundColor: "black" }}
          ></video>
        </div>
      ) : (
        <>
          {joinState && (
            <div className="fixed h-screen w-screen flex p-5 items-center justify-center z-50 top-0 left-0 bg-black">
              <div className="text-white text-lg mb-4">
                {statusMessage && <p>{statusMessage}</p>}
              </div>
              <form onSubmit={handleJoin}>
                <input
                  type="text"
                  name="roomusername"
                  value={roomUserName}
                  onChange={(e) => setRoomUserName(e.target.value)}
                  className="w-full my-4 p-2 mb-4 bg-gray-700 text-white rounded"
                  placeholder="Enter room username"
                  required
                />
                <button
                  type="submit"
                  className="w-full p-2 mt-4 bg-blue-900 text-white rounded"
                >
                  Join Room
                </button>
                <button
                  onClick={() => setJoinState(false)}
                  className="w-full p-2 mt-4 bg-red-600 text-white rounded"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
          {userData && (
            <div className="fixed bottom-0 w-full">
              <Container className="bg-black p-2 flex items-center justify-around">
                <span className="p-2 w-6/12 text-white lg:text-2xl font-bold text-lg">
                  {userData?.username}
                </span>
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => setJoinState(true)}
                    className="p-2 px-2 white text-slate-300 bg-red-900 rounded-md mx-2 lg:text-xl text-sm font-bold "
                  >
                    Join
                  </button>
                  <button
                    onClick={createRoom}
                    className="p-2 px-2 white text-slate-300 bg-red-600 rounded-md mx-2 lg:text-xl text-sm font-bold "
                  >
                    Your Room
                  </button>
                </div>
              </Container>
            </div>
          )}
        </>
      )}
    </>
  );
}
