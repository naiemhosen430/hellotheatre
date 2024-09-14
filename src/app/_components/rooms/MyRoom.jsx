"use client";
import React, { useContext, useEffect } from "react";
import VideoPlayer from "../roomComponents/VideoPlayer";
import { Container } from "react-bootstrap";
import socket from "@/api/connectIo";
import { RoomContex } from "@/Contexts/RoomContext";
import Stage from "../roomComponents/Stage";

export default function MyRoom() {
  const { roomState, roomDispatch } = useContext(RoomContex);
  useEffect(() => {
    // Notify host when a user joins the room
    socket.on("new-user", (data) => {
      console.log(data);
      roomDispatch({
        type: "ADD_NEWMEMBER",
        payload: data,
      });
      // createPeer(userId, true); // Host creates peer connection with viewer
    });

    socket.on("viewer-left", (data) => {
      console.log(data);
      roomDispatch({
        type: "REMOVE_NEWMEMBER",
        payload: data,
      });
      console.log(`User joined: ${data}`);
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
        <div>
          <Stage />
        </div>
      </Container>
    </>
  );
}
