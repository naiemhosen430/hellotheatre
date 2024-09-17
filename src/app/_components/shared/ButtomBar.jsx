"use client";
import React, { useContext, useState, useRef, useEffect } from "react";
import { Container } from "react-bootstrap";
import { AuthContex } from "@/Contexts/AuthContex";
import UseRoomContext from "@/Hooks/UseRoomContext";
import { RoomContex } from "@/Contexts/RoomContext";
import { useRouter } from "next/navigation";
import socket from "@/api/connectIo";

export default function BottomBar({ roomName }) {
  const { state } = useContext(AuthContex);
  const userData = state?.user;
  const [joinState, setJoinState] = useState(false);
  const [roomUserName, setRoomUserName] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const {
    joinRoomHandler,
    setLoading,
    loading,
    setMessage,
    message,
    createRoomHandler,
  } = UseRoomContext();
  const router = useRouter();
  // for join room
  const handleJoin = (event) => {
    event.preventDefault();
    joinRoomHandler(roomUserName);
  };
  // Create room (Host)
  const createRoom = () => {
    if (userData?.username) {
      createRoomHandler(userData?.username);
    }
  };

  const { roomState, roomDispatch } = useContext(RoomContex);

  useEffect(() => {
    // Host creates a room and starts sharing
    socket.on("room-created", (roomData) => {
      // startSharing();
      roomDispatch({
        type: "ADD_JOINEDROOM_DATA",
        payload: roomData?.roomData || null,
      });
      router.push("/meet");
      setLoading(false);
    });

    socket.on("joined-room", (roomData) => {
      if (roomData?.roomData?._id !== userData?._id){

        roomDispatch({
          type: "ADD_JOINEDROOM_DATA",
          payload: roomData?.roomData || null,
        });
        router.push("/meet");
        setLoading(false);
      }
    });
  }, [socket]);

  return (
    <>
      <Container>
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
                className="w-full my-2 focus:outline-none p-2 bg-gray-700 text-white rounded"
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
          <div className="fixed bottom-0 left-0 w-full">
            <Container className="bg-black p-2 flex items-center justify-around">
              <span className="p-2 w-6/12 lg:hidden block text-white lg:text-2xl font-bold text-lg">
                {userData?.username?.length > 13
                  ? userData?.username?.slice(0, 13) + "..."
                  : userData?.username}
              </span>
              <span className="p-2 w-6/12 hidden lg:block text-white lg:text-2xl font-bold text-lg">
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
      </Container>
    </>
  );
}
