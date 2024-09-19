"use client";
import React, { useContext, useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import socket from "@/api/connectIo";
import { RoomContex } from "@/Contexts/RoomContext";
import { useRouter } from "next/navigation";
import { AuthContex } from "@/Contexts/AuthContex";
import DisplayHostVideo from "../roomComponents/DisplayHostVideo";

export default function OtherRoom() {
  const { state } = useContext(AuthContex);
  const router = useRouter();
  const userData = state?.user;
  const { roomState, roomDispatch } = useContext(RoomContex);
  const { room, joinedroom } = roomState;

  const localAudioRef = useRef();
  const remoteAudioRef = useRef();
  const peerConnections = useRef({});

  useEffect(() => {
    // Get local audio stream
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        localAudioRef.current.srcObject = stream; // Set local audio stream
        // Start connection to host
        socket.emit("join-room", room._id); // Emit join room event (or your specific event)
      })
      .catch((error) => {
        console.error("Error accessing audio devices.", error);
      });

    // Handle user join and signaling for audio
    socket.on("new-user", (data) => {
      createPeerConnection(data.socket_id);
    });

    socket.on("receive-offer", (userId, offer) => {
      handleOffer(userId, offer);
    });

    socket.on("receive-answer", (userId, answer) => {
      handleAnswer(userId, answer);
    });

    socket.on("receive-candidate", (userId, candidate) => {
      handleCandidate(userId, candidate);
    });

    // Handle other user leave
    socket.on("viewer-left", (data) => {
      if (userData?._id !== data?.user_id) {
        roomDispatch({
          type: "REMOVE_NEWMEMBER",
          payload: data,
        });
      }
    });

    socket.on("you-left", (id) => {
      if (joinedroom?._id !== userData?._id) {
        roomDispatch({
          type: "ADD_JOINEDROOM_DATA",
          payload: null,
        });
        router.push("/");
      }
    });

    return () => {
      socket.off("new-user");
      socket.off("receive-offer");
      socket.off("receive-answer");
      socket.off("receive-candidate");
      socket.off("viewer-left");
      socket.off("you-left");
    };
  }, [room, userData, roomDispatch, router]);

  const createPeerConnection = (userId) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnections.current[userId] = peerConnection;

    // Add local audio track to the peer connection
    const localStream = localAudioRef.current.srcObject;
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnection
      .createOffer()
      .then((offer) => {
        return peerConnection.setLocalDescription(offer);
      })
      .then(() => {
        socket.emit("send-offer", userId, peerConnection.localDescription);
      });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("send-candidate", userId, event.candidate);
      }
    };

    // When remote audio track is received
    peerConnection.ontrack = (event) => {
      const remoteAudio = remoteAudioRef.current;
      remoteAudio.srcObject = event.streams[0]; // Set the received audio stream
    };
  };

  const handleOffer = (userId, offer) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnections.current[userId] = peerConnection;

    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    // Add local audio track to the peer connection
    const localStream = localAudioRef.current.srcObject;
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnection
      .createAnswer()
      .then((answer) => {
        return peerConnection.setLocalDescription(answer);
      })
      .then(() => {
        socket.emit("send-answer", userId, peerConnection.localDescription);
      });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("send-candidate", userId, event.candidate);
      }
    };

    peerConnection.ontrack = (event) => {
      const remoteAudio = remoteAudioRef.current;
      remoteAudio.srcObject = event.streams[0]; // Set the received audio stream
    };
  };

  const handleAnswer = (userId, answer) => {
    const peerConnection = peerConnections.current[userId];
    if (peerConnection) {
      peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleCandidate = (userId, candidate) => {
    const peerConnection = peerConnections.current[userId];
    if (peerConnection) {
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  return (
    <>
      <audio
        ref={remoteAudioRef}
        autoPlay
        controls
        style={{ display: "none" }} // Hide remote audio element
      />
      <Container className="bg-black h-screen px-0">
        <div>
          <DisplayHostVideo />
        </div>
      </Container>
    </>
  );
}
