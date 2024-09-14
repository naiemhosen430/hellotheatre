"use client";
import React, { useState, useRef, useEffect, useContext } from "react";
import { IoMdSettings } from "react-icons/io";
import socket from "@/api/connectIo";
import { AuthContex } from "@/Contexts/AuthContex";
import { useRouter } from "next/navigation";
import { RoomContex } from "@/Contexts/RoomContext";
import { RxAvatar } from "react-icons/rx";

// Configuration for WebRTC
const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function UserPage() {
  const [settingToggleBox, setSettingToggleBox] = useState(false);
  const [peerConnections, setPeerConnections] = useState({});
  const [remoteStreams, setRemoteStreams] = useState({});
  const localAudioRef = useRef(null);
  const { state } = useContext(AuthContex);
  const userData = state?.user;
  const router = useRouter();
  const { roomState, roomDispatch } = useContext(RoomContex);
  const { room, joinedroom } = roomState;

  const togleSettingBox = () => {
    setSettingToggleBox(!settingToggleBox);
  };

  // Handle leaving the room
  const leaveRoom = () => {
    socket.emit("leave-room", {
      username: joinedroom?.username,
      user_id: userData?._id,
    });
  };

  useEffect(() => {
    const localStream = new MediaStream();
    const peers = {};

    socket.on("you-left", (id) => {
      roomDispatch({
        type: "ADD_JOINEDROOM_DATA",
        payload: null,
      });
      router.push("/");
    });

    // Get local media stream
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        localAudioRef.current.srcObject = stream;
        localStream.addTrack(stream.getAudioTracks()[0]);

        // Join room
        socket.emit("join-room", { roomId: "your-room-id", isHost: false });

        // Handle incoming connections
        socket.on("new-user", (id) => {
          createPeerConnection(id);
        });

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
          [id]: URL.createObjectURL(event.streams[0]), // Store object URL for video playback
        }));
      };

      localStream
        .getTracks()
        .forEach((track) => pc.addTrack(track, localStream));

      setPeerConnections((prev) => ({
        ...prev,
        [id]: pc,
      }));

      return pc;
    }
  }, [router, roomDispatch]);

  console.log(remoteStreams);
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
                Leave Room
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
            {/* Display the host's video stream */}
            {remoteStreams["host"] && (
              <video
                width="100%"
                height="500"
                controls
                autoPlay
                muted
                className="lg:max-h-[400px] max-h-[250px]"
              >
                <source src={remoteStreams["host"]} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>

        <div className="w-12/12 lg:w-4/12">
          <h1 className="p-2 text-slate-400 bg-slate-800 text-xl lg:text-sm">
            People ({joinedroom?.users?.length})
          </h1>
          <div className="p-4 px-2">
            <div className="flex">
              <div className="flex p-2 text-white justify-center">
                <RxAvatar className="lg:text-5xl text-4xl" />
              </div>
              <div className="p-2">
                <div className="shadow-2xl lg:text-sm text-[10px] bg-black text-white flex items-center justify-center border-blue-500 p-2 px-3 border rounded-xl">
                  Hey there, this project is still under construction
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Local audio stream (for voice chat) */}
      <audio
        ref={localAudioRef}
        autoPlay
        muted
        className="hidden" // Hide the local audio element
      />
    </>
  );
}
