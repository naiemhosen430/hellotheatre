"use client";
import { useContext, useState } from "react";
import { getApiCall, patchApiCall, postApiCall } from "@/api/fatchData";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { RoomContex } from "@/Contexts/RoomContext";
import { AuthContex } from "@/Contexts/AuthContex";
import socket from "@/api/connectIo";

export default function UseRoomContext() {
  const [loading, setLoading] = useState(false);
  const roomContex = useContext(RoomContex);
  const { roomState, roomDispatch } = useContext(RoomContex);
  const { room, joinedroom } = roomState;
  const [message, setMessage] = useState(false);
  const router = useRouter();
  const { state, dispatch } = useContext(AuthContex);
  const userData = state?.user;

  if (!roomContex) {
    throw new Error("Application Error");
  }

  // for joining any room
  const joinRoomHandler = (roomUserName) => {
    setLoading(true);
    socket.emit("join-room", {
      username: roomUserName,
      user_id: userData?._id,
    });
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
        console.log(roomDispatch);
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
