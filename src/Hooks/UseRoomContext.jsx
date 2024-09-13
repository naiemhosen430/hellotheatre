"use client";
import { useContext, useState } from "react";
import { getApiCall, patchApiCall, postApiCall } from "@/api/fatchData";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { RoomContex } from "@/Contexts/RoomContext";
import socket from "@/api/connectIo";

export default function UseRoomContext() {
  const [loading, setLoading] = useState(false);
  const authContext = useContext(RoomContex);
  const { roomState, roomDispatch } = useContext(RoomContex);
  const { room, joinedroom } = roomState;
  const [message, setMessage] = useState(false);
  const router = useRouter();

  if (!authContext) {
    throw new Error("Application Error");
  }

  // for joining any room
  const joinRoomHandler = (roomUserName) => {
    setLoading(true);
    socket.emit("join-room", { username: roomUserName });
  };

  // for create room
  const createRoomHandler = (username) => {
    setLoading(true);
    socket.emit("create-room", username);
  };

  const getAllRooms = async () => {
    try {
      const response = await getApiCall("user");
      if (response?.statusCode === 200 && response?.data) {
        roomDispatch({
          type: "ADD_AllROOM_DATA",
          payload: [...room, ...response?.data],
        });
      }
    } catch (error) {}
  };

  return {
    getAllRooms,
    createRoomHandler,
    joinRoomHandler,
    setLoading,
    loading,
    setMessage,
    message,
  };
}
