"use client";
import socket from "@/api/connectIo";
import React, { useContext, useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { BiMessageRoundedDots } from "react-icons/bi";
import { AuthContex } from "@/Contexts/AuthContex";
import Image from "next/image";
import { RoomContex } from "@/Contexts/RoomContext";

const handleSubboxClick = (event) => {
  event.stopPropagation();
};

export default function MessageBox() {
  const [messageData, setMessageData] = useState([]);
  const [messageText, setMessageText] = useState("");
  const { state } = useContext(AuthContex);
  const userData = state?.user;
  const [focused, setFocused] = useState(false);
  const { roomState } = useContext(RoomContex);
  const { joinedroom } = roomState;

  useEffect(() => {
    socket.on("message-recieve", (data) => {
      setMessageData((prevData) => [...prevData, data]);
    });
    return () => {
      socket.off("message-recieve");
    };
  }, []);

  const sendMessage = () => {
    socket.emit("message-sent", {
      to: joinedroom?.username,
      name: userData?.fullname,
      message: messageText,
    });
    setMessageText("");
  };

  return (
    <div className="relative sticky bottom-0 z-[100] rounded-t-2xl overflow-hidden shadow-lg bg-gray-900 w-full h-[15px] flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 bg-gray-800">
        {messageData.map((data, i) => (
          <div
            key={i}
            className="flex items-start bg-blue-800 p-3 rounded-lg mb-2 shadow-md"
          >
            <div className="mr-2">
              <Image
                className="object-cover w-10 h-10 rounded-full border-2 border-blue-700"
                width={500}
                height={500}
                src={data?.profilephoto || "/default.jpeg"}
                alt="Profile"
              />
            </div>
            <div className="flex-1">
              <p className="text-gray-400 text-xs font-semibold">
                {data?.from}
              </p>
              <p className="text-white text-sm p-1 py-0 rounded-md">
                {data?.message}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div classname="absolute bottom-0">
        {focused && (
          <div className=" items-end bg-gray-800 px-2 py-1 flex  border-t border-gray-700">
            <input
              className="w-full rounded-l-2xl bg-gray-700 text-white placeholder-gray-400 p-2"
              type="text"
              value={messageText}
              placeholder="Type your message..."
              onChange={(e) => setMessageText(e.target.value)}
              autoFocus
            />
            <div className="w-12 bg-black rounded-r-2xl flex items-center justify-center">
              <IoSend
                onClick={sendMessage}
                className="cursor-pointer text-xl text-white"
              />
            </div>
          </div>
        )}

        <div className=" w-full flex justify-center">
          <div className="pr-1">
            <div
              onClick={() => setFocused(true)}
              className="flex items-center cursor-pointer px-4 py-2 bg-blue-700 text-white rounded-full shadow-md"
            >
              <BiMessageRoundedDots className="text-lg" />
              <p className="pl-2 text-sm">Send message</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
