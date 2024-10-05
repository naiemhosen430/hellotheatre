"use client";
import { useContext, useState, useEffect } from "react";
import { RoomContex } from "@/Contexts/RoomContext";
import TheatreCart from "../_components/roomComponents/TheatreCart";
import RoomLoaderCart from "../_components/loaders/RoomLoaderCart";
import { Container } from "react-bootstrap";
import { IoSearch } from "react-icons/io5";
import { TbMoodSad } from "react-icons/tb";

export default function page() {
  const { roomState, roomDispatch } = useContext(RoomContex);
  const rooms = roomState?.room;
  const [search_text, set_search_text] = useState("");
  const [all_rooms, set_all_rooms] = useState(null);

  useEffect(() => {
    if (search_text) {
      const searchedData = rooms?.filter((room) => {
        const text = `${room.fullname} ${room.username} ${room.tittle}`.toLowerCase();
        return text.includes(search_text.toLowerCase());
      });
      set_all_rooms(searchedData);
    } else {
      set_all_rooms(rooms);
    }
  }, [rooms, search_text]);

  return (
    <>
      <Container>
        <div className="flex items-center">
          <input
            className="text-[14px] leading-[17.07px] w-full p-[18px] px-[18px] placeholder-white text-white font-[400] bg-[#6700B6] rounded-[20px]"
            value={search_text}
            name="search"
            onChange={(e) => set_search_text(e.target.value)}
            placeholder="Search Theatre..."
          />
          <IoSearch className="ml-[-40px] inline-block text-2xl text-white" />
        </div>
        <h1 className="p-2 text-slate-400 bg-slate-800 text-xl lg:text-sm">
          Active theatre {!rooms ? "loading room...." : `(${rooms?.length})`}
        </h1>
        <div className="p-4 px-0">
          {all_rooms?.length === 0 && (
            <div className="text-center">
              <TbMoodSad className="text-[100px] text-blue-500 m-3 inline-block" />
              <h1 className="text-2xl text-blue-500 text-center">
                No active room right now!
              </h1>
            </div>
          )}
          {all_rooms?.map((room) => (
            <div key={room._id} className="overflow-hidden">
              <TheatreCart room={room} />
            </div>
          ))}
          {!all_rooms && (
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
      </Container>
    </>
  );
}
