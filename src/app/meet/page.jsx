"use client";
import MyRoom from "../_components/rooms/MyRoom";
import OtherRoom from "../_components/rooms/OtherRoom";
import { AuthContex } from "@/Contexts/AuthContex";
import { RoomContex } from "@/Contexts/RoomContext";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState, useRef } from "react";
import { Container } from "react-bootstrap";
import socket from "@/api/connectIo";

export default function page() {
  const { state } = useContext(AuthContex);
  const userData = state?.user;
  const { roomState, roomDispatch } = useContext(RoomContex);
  const { room, joinedroom } = roomState;
  const router = useRouter();
  const localAudioRef = useRef();
  const remoteAudioRef = useRef();
  const [localStream, setLocalStream] = useState(null);
  const peerConnections = useRef({});

  if (!userData || !joinedroom) {
    router.push("/", { scroll: true });
  }

  useEffect(() => {
    startLocalStream();
    socket.on("new-user", handleNewUser);
    socket.on("viewer-left", handleViewerLeft);
    socket.on("you-left", handleYouLeft);

    socket.on("signal", async ({ from, signal }) => {
      console.log({ from, signal });
      if (signal.type === "offer") {
        // Create an answer
        const pc = new RTCPeerConnection();
        peerConnections.current[from] = pc;

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("signal", {
              to: joinedroom?.username,
              signal: event.candidate,
            });
          }
        };

        pc.ontrack = (event) => {
          // Add the remote stream to the video/audio element
          const remoteAudio = document.getElementById("remoteAudio");
          remoteAudio.srcObject = event.streams[0];
        };

        await pc.setRemoteDescription(new RTCSessionDescription(signal));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("signal", { to: joinedroom?.username, signal: answer });
      } else if (signal.type === "answer") {
        await peerConnections.current[from].setRemoteDescription(
          new RTCSessionDescription(signal)
        );
      } else if (signal.candidate) {
        await peerConnections.current[from].addIceCandidate(
          new RTCIceCandidate(signal)
        );
      }
    });

    return () => {
      socket.off("new-user", handleNewUser);
      socket.off("viewer-left", handleViewerLeft);
      socket.off("you-left", handleYouLeft);
    };
  }, [room, userData, roomDispatch, router]);

  const handleNewUser = (data) => {
    roomDispatch({ type: "ADD_NEWMEMBER", payload: data });
  };

  const handleYouLeft = (id) => {
    if (joinedroom?._id !== userData?._id) {
      roomDispatch({ type: "ADD_JOINEDROOM_DATA", payload: null });
      router.push("/");
    }
  };

  const handleViewerLeft = (data) => {
    if (userData?._id !== data?.user_id) {
      roomDispatch({ type: "REMOVE_NEWMEMBER", payload: data });
    }
  };

  const startLocalStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setLocalStream(stream);

    stream.getTracks().forEach((track) => {
      // Broadcasting to all peers
      socket.emit("signal", { to: joinedroom?.username, signal: track });
    });
  };

  return (
    <>
    <div className="fixed top-0 left-0 w-full min-h-screen">

    <audio id="remoteAudio" autoPlay></audio>
    {localStream && <audio autoPlay muted srcObject={localStream}></audio>}
    {userData?._id === joinedroom?._id ? <MyRoom /> : <OtherRoom />}
    </div.
    </>
  );
}
