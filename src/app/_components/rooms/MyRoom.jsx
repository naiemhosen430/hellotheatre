"use client";
import React, { useContext, useEffect, useRef } from "react";
import VideoPlayer from "../roomComponents/VideoPlayer";
import { Container } from "react-bootstrap";
import socket from "@/api/connectIo";
import { RoomContex } from "@/Contexts/RoomContext";
import Stage from "../roomComponents/Stage";
import { createPeerConnection } from "@/utils/createPeerConnection";

export default function MyRoom() {
  const { roomState, roomDispatch } = useContext(RoomContex);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnections = {};
  useEffect(() => {
    // Notify host when a user joins the room
    socket.on("new-user", (data) => {
      roomDispatch({
        type: "ADD_NEWMEMBER",
        payload: data,
      });
      createPeerConnection(
        data?.socket_id,
        peerConnections,
        remoteVideoRef,
        localVideoRef,
        socket
      );
    });

    socket.on("viewer-left", (data) => {
      roomDispatch({
        type: "REMOVE_NEWMEMBER",
        payload: data,
      });
      if (peerConnections[data?.socket_id]) {
        peerConnections[data?.socket_id].close();
        delete peerConnections[data?.socket_id];
      }
    });

    return () => {
      socket.off("room-created");
      socket.off("user-joined");
      socket.off("signal");
    };
  }, []);
  return (
    <>
      <video className="hidden" ref={remoteVideoRef} autoPlay style={{ width: "300px" }} />
      <Container className="  bg-black  h-screen px-0">
        <div>
          <VideoPlayer localVideoRef={localVideoRef} />
        </div>
        <div>
          <Stage />
        </div>
      </Container>
    </>
  );
}
