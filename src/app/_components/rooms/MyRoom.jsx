"use client";
import React, { useContext, useEffect, useRef } from "react";
import VideoPlayer from "../roomComponents/VideoPlayer";
import { Container } from "react-bootstrap";
import socket from "@/api/connectIo";
import { RoomContex } from "@/Contexts/RoomContext";
import Stage from "../roomComponents/Stage";

export default function MyRoom() {
  const { roomDispatch } = useContext(RoomContex);

  const localAudioRef = useRef();
  const remoteAudioRef = useRef();
  const peerConnections = useRef({}); // Store peer connections

  useEffect(() => {
    const getLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        localAudioRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    getLocalStream();
  }, []);

  useEffect(() => {
    // Notify host when a user joins the room
    socket.on("new-user", (data) => {
      roomDispatch({ type: "ADD_NEWMEMBER", payload: data });
      createPeerConnection(data.socket_id);
    });

    socket.on("viewer-left", (data) => {
      roomDispatch({ type: "REMOVE_NEWMEMBER", payload: data });
      if (peerConnections.current[data.socket_id]) {
        peerConnections.current[data.socket_id].close();
        delete peerConnections.current[data.socket_id];
      }
    });

    socket.on("receive-audio-stream", (userId, stream) => {
      const remoteAudio = remoteAudioRef.current;
      remoteAudio.srcObject = stream; // Set the received stream to the audio element
    });

    socket.on("receive-offer", handleOffer);
    socket.on("receive-answer", handleAnswer);
    socket.on("receive-candidate", handleCandidate);

    return () => {
      socket.off("new-user");
      socket.off("viewer-left");
      socket.off("receive-audio-stream");
      socket.off("receive-offer");
      socket.off("receive-answer");
      socket.off("receive-candidate");
    };
  }, [roomDispatch]);

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
      console.error("Local stream is not available.");
    }

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

    const localStream = localAudioRef.current.srcObject;
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });
    } else {
      console.error("Local stream is not available.");
    }

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
        style={{ display: "none" }}
      />
      <Container className="bg-black h-screen px-0">
        <div>
          <VideoPlayer localVideoRef={localAudioRef} />
        </div>
        <div>
          <Stage />
        </div>
      </Container>
    </>
  );
}
