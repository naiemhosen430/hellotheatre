"use client";
import React, { useContext, useEffect } from "react";
import VideoPlayer from "../roomComponents/VideoPlayer";
import { Container } from "react-bootstrap";
import socket from "@/api/connectIo";
import { RoomContex } from "@/Contexts/RoomContext";

export default function MyRoom() {
  const { roomState, roomDispatch } = useContext(RoomContex);
  useEffect(() => {
    // Notify host when a user joins the room
    socket.on("user-joined", (userId) => {
      console.log(userId);
      roomDispatch({
        type: "ADD_NEWMEMBER",
        payload: userId,
      });
      console.log(`User joined: ${userId}`);
      // createPeer(userId, true); // Host creates peer connection with viewer
    });

    // // Signal handling for WebRTC connection
    // socket.on("signal", ({ signal, id }) => {
    //   console.log("Received signal from viewer");
    //   const peer = peersRef.current[id];
    //   if (peer) {
    //     peer.signal(signal);
    //   }
    // });

    return () => {
      socket.off("room-created");
      socket.off("user-joined");
      socket.off("signal");
    };
  }, []);
  return (
    <>
      <Container className="  bg-black  h-screen px-0">
        <div>
          <VideoPlayer />
        </div>
      </Container>
    </>
  );
}
