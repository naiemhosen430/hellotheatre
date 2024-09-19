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
    const getLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        localAudioRef.current.srcObject = stream; // Set local audio stream
        socket.emit("join-room", room._id); // Emit join room event
      } catch (error) {
        console.error("Error accessing audio devices:", error);
        alert(
          "Unable to access audio devices. Please check your microphone settings."
        );
      }
    };

    getLocalStream();

    // Handle signaling for audio
    const handleNewUser = (data) => {
      createPeerConnection(data.socket_id);
    };

    const handleViewerLeft = (data) => {
      if (userData?._id !== data?.user_id) {
        roomDispatch({ type: "REMOVE_NEWMEMBER", payload: data });
      }
    };

    const handleYouLeft = (id) => {
      if (joinedroom?._id !== userData?._id) {
        roomDispatch({ type: "ADD_JOINEDROOM_DATA", payload: null });
        router.push("/");
      }
    };

    socket.on("new-user", handleNewUser);
    socket.on("receive-offer", handleOffer);
    socket.on("receive-answer", handleAnswer);
    socket.on("receive-candidate", handleCandidate);
    socket.on("viewer-left", handleViewerLeft);
    socket.on("you-left", handleYouLeft);

    return () => {
      socket.off("new-user", handleNewUser);
      socket.off("receive-offer", handleOffer);
      socket.off("receive-answer", handleAnswer);
      socket.off("receive-candidate", handleCandidate);
      socket.off("viewer-left", handleViewerLeft);
      socket.off("you-left", handleYouLeft);
    };
  }, [room, userData, roomDispatch, router]);

  const createPeerConnection = (userId) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnections.current[userId] = peerConnection;

    const localStream = localAudioRef.current.srcObject;
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });
    } else {
      console.error("Local audio stream not available.");
    }

    peerConnection
      .createOffer()
      .then((offer) => {
        return peerConnection.setLocalDescription(offer);
      })
      .then(() => {
        socket.emit("send-offer", userId, peerConnection.localDescription);
      })
      .catch((error) => {
        console.error("Error creating offer:", error);
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

  const handleOffer = (userId, offer) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnections.current[userId] = peerConnection;

    peerConnection
      .setRemoteDescription(new RTCSessionDescription(offer))
      .then(() => {
        const localStream = localAudioRef.current.srcObject;
        if (localStream) {
          localStream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStream);
          });
        } else {
          console.error("Local audio stream not available.");
        }

        return peerConnection.createAnswer();
      })
      .then((answer) => {
        return peerConnection.setLocalDescription(answer);
      })
      .then(() => {
        socket.emit("send-answer", userId, peerConnection.localDescription);
      })
      .catch((error) => {
        console.error("Error handling offer:", error);
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
      peerConnection
        .setRemoteDescription(new RTCSessionDescription(answer))
        .catch((error) => {
          console.error("Error setting remote description for answer:", error);
        });
    }
  };

  const handleCandidate = (userId, candidate) => {
    const peerConnection = peerConnections.current[userId];
    if (peerConnection) {
      peerConnection
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch((error) => {
          console.error("Error adding ICE candidate:", error);
        });
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
