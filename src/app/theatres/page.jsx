"use client";
import { useContext, useState, useEffect } from "react";
import { RoomContex } from "@/Contexts/RoomContext";
import TheatreCart from "../_components/roomComponents/TheatreCart";
import RoomLoaderCart from "../_components/loaders/RoomLoaderCart";

export default function page() {
  const { roomState, roomDispatch } = useContext(RoomContex);
  const rooms = roomState?.room;
  return (
    <>
      <div>
        <h1 className="p-2 text-slate-400 bg-slate-800 text-xl lg:text-sm">
          Active theatre {!rooms ? "loading room...." : `(${rooms?.length})`}
        </h1>
        <div className="p-4 px-0">
          {rooms?.length === 0 && (
            <div className="text-center">
              <TbMoodSad className="text-[100px] text-blue-500 m-3 inline-block" />
              <h1 className="text-2xl text-blue-500 text-center">
                No active room right now!
              </h1>
            </div>
          )}
          {rooms?.map((room) => (
            <div key={room._id} className="overflow-hidden">
              <TheatreCart room={room} />
            </div>
          ))}
          {!rooms && (
            <div>
              <RoomLoaderCart />
              <RoomLoaderCart />
              <RoomLoaderCart />
              <RoomLoaderCart />
              <RoomLoaderCart />
              <RoomLoaderCart />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
