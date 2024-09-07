"use client";
import React, { useContext, useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { AuthContex } from "@/Contexts/AuthContex";
import connectIo from "@/api/connectIo";
import MyRoom from "../rooms/MyRoom";

export default function ButtomBar({ roomName }) {
  const socket = connectIo();
  const { state } = useContext(AuthContex);
  const userData = state?.user;
  const [joinState, setJoinState] = useState(false);
  const [roomUserName, setRoomUserName] = useState("");
  const [peerConnection, setPeerConnection] = useState(null);
  const [joined, setJoined] = useState(false);
  const [statusMessage, setStatusMessage] = useState(""); // State to hold the status message
  const [joinedMyRoomState, setJoinedMyRoomState] = useState(false);
  useEffect(() => {
    if (peerConnection) {
      socket.on("signal", async (signal) => {
        if (signal.description) {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(signal.description)
          );
          if (signal.description.type === "offer") {
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            socket.emit("signal", userData?.username, {
              description: peerConnection.localDescription,
            });
          }
        } else if (signal.candidate) {
          await peerConnection.addIceCandidate(
            new RTCIceCandidate(signal.candidate)
          );
        }
      });
    }

    return () => {
      if (peerConnection) {
        socket.off("signal");
      }
    };
  }, [peerConnection]);

  const handleLogin = async (event) => {
    event.preventDefault();

    // Emit an event to join the room with the username
    socket.emit("joinRoom", userData?.username, roomUserName);
    console.log(roomUserName);

    socket.on("userJoined", async (username) => {
      console.log(`${username} joined the room`);

      // Capture the screen instead of the webcam
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      const localVideo = document.getElementById("localVideo");
      if (localVideo) {
        localVideo.srcObject = stream;
      }

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      setPeerConnection(pc);

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("signal", userData?.username, {
            candidate: event.candidate,
          });
        }
      };

      pc.ontrack = (event) => {
        const remoteVideo = document.getElementById("remoteVideo");
        if (remoteVideo) {
          remoteVideo.srcObject = event.streams[0];
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("signal", userData?.username, {
        description: pc.localDescription,
      });

      setJoined(true); // Set joined state to true
      setStatusMessage(""); // Clear any previous status messages
    });

    socket.on("roomNotFound", () => {
      setStatusMessage("Room not available."); // Set the status message if the room is not found
    });

    socket.on("error", (error) => {
      setStatusMessage(`Error: ${error.message}`); // Handle other errors
    });

    // setRoomUserName("");
  };

  return (
    <>
      {joinedMyRoomState && (
        <MyRoom setJoinedMyRoomState={setJoinedMyRoomState} />
      )}
      {joined ? (
        <div className="fixed h-screen w-screen flex items-center justify-center z-50 top-0 left-0 bg-black">
          {/* Show the video stream from the room owner */}
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
                {statusMessage && <p>{statusMessage}</p>}{" "}
                {/* Show status message */}
              </div>
              <form onSubmit={handleLogin}>
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
                    title="You are unmute now"
                    onClick={() => setJoinState(true)}
                    className="p-2 px-2 white text-slate-300 bg-red-900 rounded-md mx-2 lg:text-xl text-sm font-bold "
                  >
                    Join
                  </button>
                  <button
                    title="Share this room"
                    onClick={() => setJoinedMyRoomState(true)}
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
