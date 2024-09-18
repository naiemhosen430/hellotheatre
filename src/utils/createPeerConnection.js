export const createPeerConnection = (
  userId,
  peerConnections,
  remoteVideoRef,
  localVideoRef,
  socket
) => {
  const peerConnection = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }, // STUN server
    ],
  });

  peerConnections[userId] = peerConnection;

  // When receiving tracks from the remote peer
  peerConnection.ontrack = (event) => {
    const remoteVideo = remoteVideoRef.current;
    remoteVideo.srcObject = event.streams[0];
  };

  // Add local tracks to the peer connection
  const localStream = localVideoRef.current.srcObject;
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  // Create an offer and send it to the remote peer
  peerConnection
    .createOffer()
    .then((offer) => {
      return peerConnection.setLocalDescription(offer);
    })
    .then(() => {
      socket.emit("send-offer", userId, peerConnection.localDescription);
    });

  // Handle incoming answers
  socket.on("receive-answer", (userId, answer) => {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  });

  // Handle ICE candidates
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("send-candidate", userId, event.candidate);
    }
  };

  socket.on("receive-candidate", (userId, candidate) => {
    peerConnections[userId].addIceCandidate(new RTCIceCandidate(candidate));
  });
};
