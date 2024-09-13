import React from "react";
import UseRoomContext from "@/Hooks/UseRoomContext";

export default function TheatreCart({ room }) {
  const {
    joinRoomHandler,
    setLoading,
    loading,
    setMessage,
    message,
    createRoomHandler,
  } = UseRoomContext();
  return (
    <>
      <div
        onClick={() => {
          joinRoomHandler(room?.username);
        }}
        className="p-2 px-3 my-2 bg-black/50 cursor-pointer rounded-2xl border-2 border-blue-500 shadow-lg"
      >
        <h1 className="text-white text-xl font-bold px-2 p-0 m-0">
          {room?.fullname}
        </h1>
        <p className="px-2 p-0 m-0 text-white text-sm">
          {room?.tittle ? room?.tittle : "No title of the room"}
        </p>
      </div>
    </>
  );
}
