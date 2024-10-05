"use client";
import MyRoom from "../_components/rooms/MyRoom";
import OtherRoom from "../_components/rooms/OtherRoom";
import { AuthContex } from "@/Contexts/AuthContex";
import { RoomContex } from "@/Contexts/RoomContext";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useRef } from "react";
import socket from "@/api/connectIo";

export default function Page() {
  const { state } = useContext(AuthContex);
  const userData = state?.user;
  const { roomState, roomDispatch } = useContext(RoomContex);
  const { joinedroom } = roomState;
  const router = useRouter();
  const localStream = useRef(null);
  const peerConnections = useRef({});

  useEffect(() => {
    startLocalStream();
    socket.on("new-user", handleNewUser);
    socket.on("viewer-left", handleViewerLeft);
    socket.on("you-left", handleYouLeft);
    socket.on("signal", handleSignal);

    return () => {
      socket.off("new-user", handleNewUser);
      socket.off("viewer-left", handleViewerLeft);
      socket.off("you-left", handleYouLeft);
      socket.off("signal", handleSignal);
    };
  }, [joinedroom, userData, roomDispatch, router]);

  const handleSignal = async ({ from, signal }) => {
    if (signal.type === "offer") {
      await handleOffer(from, signal);
    } else if (signal.type === "answer") {
      await peerConnections.current[from].setRemoteDescription(
        new RTCSessionDescription(signal)
      );
    } else if (signal.candidate) {
      await peerConnections.current[from].addIceCandidate(
        new RTCIceCandidate(signal)
      );
    }
  };

  const handleNewUser = (data) => {
    roomDispatch({ type: "ADD_NEWMEMBER", payload: data });
    // Start a connection with the new user
    createPeerConnection(data.user_id);
  };

  const createPeerConnection = (userId) => {
    console.log({ userId });
    const pc = new RTCPeerConnection();
    peerConnections.current[userId] = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("signal", {
          to: userId,
          signal: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      const remoteAudio = document.createElement("audio");
      remoteAudio.srcObject = event.streams[0];
      remoteAudio.autoPlay = true;
      document.body.appendChild(remoteAudio); // Append to body or manage in your UI
    };

    // Add local stream tracks to the peer connection
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStream.current);
      });
    }
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
      // Clean up peer connection when a user leaves
      if (peerConnections.current[data.user_id]) {
        peerConnections.current[data.user_id].close();
        delete peerConnections.current[data.user_id];
      }
    }
  };

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      localStream.current = stream;

      // Broadcast the local stream to all existing users
      for (const id in peerConnections.current) {
        stream.getTracks().forEach((track) => {
          peerConnections.current[id].addTrack(track, stream);
        });
      }
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  const handleOffer = async (from, signal) => {
    createPeerConnection(from); // Create a connection for the new user
    await peerConnections.current[from].setRemoteDescription(
      new RTCSessionDescription(signal)
    );
    const answer = await peerConnections.current[from].createAnswer();
    await peerConnections.current[from].setLocalDescription(answer);
    socket.emit("signal", { to: from, signal: answer });
  };

  // Redirect if not logged in or not in a room
  if (!userData || !joinedroom) {
    router.push("/", { scroll: true });
    return null; // Prevent rendering when redirecting
  }

  return (
    <div className="fixed top-0 z-[1000] bg-[#46007C] left-0 w-full min-h-screen">
      {localStream.current && (
        <audio autoPlay muted srcObject={localStream.current}></audio>
      )}
      {userData?._id === joinedroom?._id ? <MyRoom /> : <OtherRoom />}
    </div>
  );
}
