"use client";
import React, { useState, useRef, useEffect, useContext } from "react";
import { FaPlus } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { IoMdSettings } from "react-icons/io";
import socket from "@/api/connectIo";
import { AuthContex } from "@/Contexts/AuthContex";
import { useRouter } from "next/navigation";
import { RoomContex } from "@/Contexts/RoomContext";

// Configuration for WebRTC
const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoPlayer() {
  const [videoId, setVideoId] = useState("TlC_NCowUuQ"); // Default YouTube video ID
  const [videoUrl, setVideoUrl] = useState(null); // For local video playback
  const [errorData, setErrorData] = useState("");
  const [settingToggleBox, setSettingToggleBox] = useState(false);
  const [peerConnections, setPeerConnections] = useState({});
  const [remoteStreams, setRemoteStreams] = useState({});
  const inputRef = useRef(null);
  const fileInputRef = useRef(null); // Ref for the hidden file input
  const localVideoRef = useRef(null); // Ref for the local video playback
  const { state } = useContext(AuthContex);
  const userData = state?.user;
  const router = useRouter();
  const { roomState, roomDispatch } = useContext(RoomContex);
  const { room, joinedroom } = roomState;

  // Handles YouTube URL input
  const handleVideoChange = (url) => {
    try {
      const urlObj = new URL(url);
      // Check if the hostname is YouTube
      if (!["www.youtube.com", "youtu.be"].includes(urlObj.hostname)) {
        console.log("Invalid URL. Please enter a valid YouTube URL.");
        return;
      }

      const videoId =
        urlObj.searchParams.get("v") || urlObj.pathname.split("/").pop();
      setVideoId(videoId);
      setVideoUrl(null); // Clear local video URL
      setErrorData("");
    } catch (error) {
      setErrorData("Invalid URL. Please enter a valid YouTube URL.");
    }
  };

  // Handles file input
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoUrl(URL.createObjectURL(file));
      setVideoId(""); // Clear YouTube video ID
      setErrorData("");
    }
  };

  // Trigger the file input click
  const handlePlayFromDevice = () => {
    fileInputRef.current.click(); // Programmatically click the file input
  };

  // Clear the file input and video URL
  const handleDefaultVideo = () => {
    inputRef.current.value = ""; // Clear the input field
    setVideoUrl(null); // Clear local video URL
    setVideoId(""); // Clear YouTube video ID
  };

  // Toggle settings box
  const togleSettingBox = () => {
    setSettingToggleBox(!settingToggleBox);
  };

  // Handle leaving the room
  const leaveRoom = () => {
    socket.emit("close-room", { userid: userData?._id });
  };
  const localStream = new MediaStream();
  const peers = {};

  // Set up WebRTC peer connections
  useEffect(() => {
    // Handle incoming connections
    socket.on("new-user", (id) => {
      console.log({ useid: id });
      createPeerConnection(id);
    });

    // Get local media stream
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        // localVideoRef.current.srcObject = stream;
        localStream.addTrack(stream.getAudioTracks()[0]);

        // Handle offer
        socket.on("offer", async ({ id, offer }) => {
          const pc = createPeerConnection(id);
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("answer", { id, answer });
        });

        // Handle answer
        socket.on("answer", async ({ id, answer }) => {
          const pc = peers[id];
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        });

        // Handle ICE candidates
        socket.on("ice-candidate", async ({ id, candidate }) => {
          const pc = peers[id];
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (e) {
            console.error("Error adding received ice candidate", e);
          }
        });

        // Handle room closure
        socket.on("room-closed", () => {
          console.log("Room has been closed");
          roomDispatch({
            type: "ADD_JOINEDROOM_DATA",
            payload: null,
          });
          router.push("/");
        });

        // Cleanup
        return () => {
          Object.values(peers).forEach((pc) => pc.close());
          socket.off("new-user");
          socket.off("offer");
          socket.off("answer");
          socket.off("ice-candidate");
          socket.off("room-closed");
        };
      })
      .catch((error) => console.error("Error accessing media devices.", error));
  }, [router, roomDispatch, room?.id]);

  // Create peer connection
  function createPeerConnection(id) {
    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { id, candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStreams((prev) => ({
        ...prev,
        [id]: event.streams[0],
      }));
    };

    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

    setPeerConnections((prev) => ({
      ...prev,
      [id]: pc,
    }));

    return pc;
  }

  return (
    <>
      {settingToggleBox && (
        <div className="fixed z-[500] top-0 right-0 h-screen w-screen bg-black/50 flex justify-end">
          <div className="lg:w-3/12 w-8/12 h-screen bg-slate-950 shadow-lg">
            <h1 className="p-2 border-b-2 lg:p-5 text-white font-bold text-2xl lg:text-4xl">
              Room Setting
            </h1>
            <div className="p-2 lg:p-5">
              <button className="bg-slate-900 text-2xl font-bold text-slate-300 w-full text-left p-2 px-4">
                Minimize
              </button>
              <button
                onClick={leaveRoom}
                className="bg-slate-900 text-2xl font-bold text-slate-300 w-full text-left p-2 px-4"
              >
                Close Room
              </button>
              <button
                onClick={togleSettingBox}
                className="bg-slate-900 text-2xl font-bold text-slate-300 w-full text-left p-2 px-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="lg:flex">
        <div className="w-12/12 lg:w-8/12">
          <div className="flex items-center justify-between p-2 text-slate-400 font-bold bg-slate-800">
            <div className="flex items-center">
              <div>
                <h1 className="text-lg leading-[10px] lg:text-xl">
                  Hello Theatre
                </h1>
                <p className="text-[5px] m-0 leading-[10px] text-blue-500">
                  Produced by NanAi
                </p>
              </div>
              <div className="px-4">
                <h1 className="leading-[10px] text-sm lg:text-xl text-white font-bold">
                  {joinedroom?.fullname}
                </h1>
              </div>
            </div>
            <div>
              <IoMdSettings
                onClick={togleSettingBox}
                className="text-2xl text-white"
              />
            </div>
          </div>
          <div className="border-2 border-x-sky-950">
            {/* Conditionally render iframe or video element based on source */}
            {videoUrl ? (
              <video
                ref={localVideoRef}
                width="100%"
                height="500"
                controls
                className="lg:max-h-[400px] max-h-[250px]"
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <iframe
                id="youtubePlayer"
                className="lg:max-h-[400px] max-h-[250px]"
                width="100%"
                height="500"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&rel=0&controls=1&modestbranding=0&iv_load_policy=3&fs=1&playsinline=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="autoplay"
                allowFullScreen
              ></iframe>
            )}

            {errorData && (
              <p className="text-white text-[10px] px-2">{errorData}</p>
            )}
            <div className="suggestions overflow-hidden overflow-y-auto px-2 flex items-center">
              <input
                type="text"
                placeholder="Enter YouTube URL"
                ref={inputRef}
                className="w-8/12 p-2 m-1 lg:text-sm text-[10px] rounded-md bg-slate-700 text-white"
                onChange={(e) => handleVideoChange(e.target.value)}
              />
              <button
                className="bg-slate-700 w-3/12 text-white px-2 py-2 m-1 rounded-xl lg:text-sm text-[10px]"
                onClick={handleDefaultVideo}
              >
                Clear Video
              </button>
              <button
                className="bg-slate-700 w-1/12 text-white px-1 py-2 m-1 text-center flex items-center justify-center rounded-xl lg:text-2xl text-xl"
                onClick={handlePlayFromDevice}
              >
                <FaPlus />
              </button>
              <input
                type="file"
                accept="video/*"
                ref={fileInputRef} // Reference to the hidden file input
                onChange={handleFileChange}
                className="hidden" // Hide the file input
              />
            </div>
          </div>
        </div>

        <div className="w-12/12 lg:w-4/12">
          <h1 className="p-2 text-slate-400 bg-slate-800 text-xl lg:text-sm">
            People ({joinedroom?.users?.length})
          </h1>
          <div className="p-4 px-2">
            {joinedroom?.users?.map((user) => (
              <div key={user} className="flex mb-4">
                <div className="flex p-2 text-white justify-center">
                  <RxAvatar className="lg:text-5xl text-4xl" />
                </div>
                <div className="p-2">
                  <div className="shadow-2xl lg:text-sm text-[10px] bg-black text-white flex items-center justify-center border-blue-500 p-2 px-3 border rounded-xl">
                    {user}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
