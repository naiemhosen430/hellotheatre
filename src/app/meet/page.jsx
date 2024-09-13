"use client";
import React, { useContext } from "react";
import MyRoom from "../_components/rooms/MyRoom";
import OtherRoom from "../_components/rooms/OtherRoom";
import { AuthContex } from "@/Contexts/AuthContex";
import { RoomContex } from "@/Contexts/RoomContext";
import { useRouter } from "next/navigation";

export default function page() {
  const { state } = useContext(AuthContex);
  const userData = state?.user;
  const { roomState, roomDispatch } = useContext(RoomContex);
  const { room, joinedroom } = roomState;
  const router = useRouter();

  if (!userData || !joinedroom) {
    router.push("/", { scroll: true });
  }

  console.log({ userData, joinedroom });

  // // Host starts sharing the screen
  // const startSharing = async () => {
  //   try {
  //     const displayStream = await navigator.mediaDevices.getDisplayMedia({
  //       video: true,
  //       audio: true,
  //     });
  //     setStream(displayStream);

  //     displayStream.getTracks().forEach((track) => {
  //       Object.values(peersRef.current).forEach((peer) =>
  //         peer.addTrack(track, displayStream)
  //       );
  //     });

  //     const video = document.createElement("video");
  //     video.srcObject = displayStream;
  //     video.muted = true;
  //     video.play();
  //     document.body.appendChild(video);
  //   } catch (err) {
  //     console.error("Error starting display sharing: ", err);
  //   }
  // };

  // const createPeer = (userId, initiator = false) => {
  //   const peer = new SimplePeer({
  //     initiator,
  //     trickle: false,
  //     stream: initiator ? stream : null, // Send stream if host
  //   });

  //   peer.on("signal", (signal) => {
  //     socket.emit("signal", {
  //       signal,
  //       username: userData?.username,
  //       id: userId,
  //     });
  //   });

  //   peersRef.current[userId] = peer;
  // };

  // const usercreatePeer = (userId) => {
  //   const peer = new SimplePeer({
  //     initiator: false, // Viewer is not the initiator
  //     trickle: false,
  //   });

  //   peer.on("signal", (signal) => {
  //     socket.emit("signal", { signal, username: roomUserName, id: userId });
  //   });

  //   peer.on("stream", (remoteStream) => {
  //     const remoteVideo = document.getElementById("remoteVideo");
  //     remoteVideo.srcObject = remoteStream;
  //     remoteVideo.play();
  //   });

  //   peersRef.current[userId] = peer;
  // };

  // socket.on("signal", ({ signal, id }) => {
  //   const peer = peersRef.current[id];
  //   if (peer) {
  //     peer.signal(signal);
  //   }
  // });

  return <>{userData?._id === joinedroom?._id ? <MyRoom /> : <OtherRoom />}</>;
}
