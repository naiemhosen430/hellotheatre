"use client";
import React, { useState, useRef, useEffect, useContext } from "react";
import { IoMdSettings } from "react-icons/io";
import socket from "@/api/connectIo";
import { AuthContex } from "@/Contexts/AuthContex";
import { useRouter } from "next/navigation";
import { RoomContex } from "@/Contexts/RoomContext";
import { RxAvatar } from "react-icons/rx";
import StagePerson from "./StagePerson";
import MessageBox from "./MessageBox";

export default function UserPage() {
  const [settingToggleBox, setSettingToggleBox] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState({});
  const localAudioRef = useRef(null);
  const { state } = useContext(AuthContex);
  const userData = state?.user;
  const router = useRouter();
  const { roomState, roomDispatch } = useContext(RoomContex);
  const { room, joinedroom, room_members } = roomState;

  const remoteVideoRef = useRef();
  const peerConnections = {};

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
    socket.on("room-closed-notification", () => {
      roomDispatch({ type: "ADD_JOINEDROOM_DATA", payload: null });
      router.push("/");
    });

    socket.on("receive-stream", (userId, stream) => {
      if (socket.id === userId) return; // Ignore own stream
      const remoteStream = new MediaStream();
      stream.getTracks().forEach((track) => remoteStream.addTrack(track));
      remoteVideoRef.current.srcObject = remoteStream;
    });

    return () => {
      socket.off("room-closed-notification");
      socket.off("receive-stream");
    };
  }, [router, roomDispatch]);
  return (
    <>
      {settingToggleBox && (
        <div className="fixed z-[500] top-0 right-0 w-screen bg-black/50 flex justify-end">
          <div className="lg:w-3/12 w-8/12 bg-slate-950 shadow-lg">
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
          <div className="flex bg-[#46007C] items-center justify-between p-3 text-slate-400 font-bold bg-transfarent">
            <div className="py-2">
              <h1 className="leading-[10px] text-sm lg:text-xl text-white font-bold">
                {joinedroom?.fullname}
              </h1>
            </div>
            <div>
              <IoMdSettings
                onClick={togleSettingBox}
                className="text-2xl text-white"
              />
            </div>
          </div>
          <div className=" overflow-hidden max-h-[400px] bg-black w-full rounded-2xl">
            {/* Display the host's video stream */}
            {remoteVideoRef ? (
              <video ref={remoteVideoRef} autoPlay style={{ width: "100%" }} />
            ) : (
              <p className="text-white text-center py-5 px-2">
                No video availabe!
              </p>
            )}
          </div>
        </div>

        <div className="w-12/12 lg:w-4/12">
          <div className="p-4 px-2">
            {room_members?.map((user, i) => {
              return (
                <div key={i} className="inline-block m-2">
                  <StagePerson id={user[0]?.user_id} />
                </div>
              );
            })}
          </div>
          {/* <h1 className="p-2 text-slate-400 bg-slate-800 text-xl lg:text-sm">
            People ({joinedroom?.users?.length})
          </h1> */}

          <MessageBox />
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
