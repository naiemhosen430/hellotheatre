"use client";
import React, { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import socket from "@/api/connectIo";
import { RoomContex } from "@/Contexts/RoomContext";
import { AuthContex } from "@/Contexts/AuthContex";
import DisplayHostVideo from "../roomComponents/DisplayHostVideo";

export default function OtherRoom() {
  const { state } = useContext(AuthContex);
  const userData = state?.user;
  const { roomState, roomDispatch } = useContext(RoomContex);
  useEffect(() => {
    // // Signal handling for WebRTC connection
    // socket.on("signal", ({ signal, id }) => {
    //   console.log("Received signal from viewer");
    //   const peer = peersRef.current[id];
    //   if (peer) {
    //     peer.signal(signal);
    //   }
    // });

    // Handle other user leave
    socket.on("viewer-left", (data) => {
      if (userData?._id !== data?.user_id) {
        roomDispatch({
          type: "REMOVE_NEWMEMBER",
          payload: data,
        });
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
      <Container className="  bg-black  h-screen px-0">
        <div>
          <DisplayHostVideo />
        </div>
      </Container>
    </>
  );
}
