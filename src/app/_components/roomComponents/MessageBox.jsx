"use client";
import socket from "@/api/connectIo";
import React, { useContext, useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { BiMessageRoundedDots } from "react-icons/bi";
import { AuthContex } from "@/Contexts/AuthContex";
import Image from "next/image";
import { RoomContex } from "@/Contexts/RoomContext";
import { FaAngleUp } from "react-icons/fa";

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
    <div className="  z-[100] rounded-t-[30px] shadow-t-[50px] overflow-hidden shadow-lg bg-gray-900 lg:w-[440px] w-full fixed bottom-0 flex flex-col">
      <div className=" w-full rounded-t-2xl bg-{#46007C}">
        <div
          onClick={() => setFocused(!focused)}
          className="w-full cursor-pointer text-center px-2 py-4 border-blue-700 text-white shadow-md"
        >
          <FaAngleUp className="text-[30px]  inline-block" />
          <p className="m-0 leading-[10px] block text-center text-[15px]">
            Chat
          </p>
        </div>
      </div>
      {focused && (
        <>
          <div className="flex-1 max-h-[400px] overflow-y-auto p-2 bg-gray-800">
            {messageData.reverse().map((data, i) => (
              <div
                key={i}
                className="flex items-start bg-[#] p-1 px-2 rounded-lg mb-2 shadow-md"
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
                <div className="h-[2px]">
                  <p className="text-gray-400 leading-[15px] text-xs p-1 py-0 font-semibold">
                    {data?.from}
                  </p>
                  <p className="text-white leading-[15px] text-sm p-1 py-0 rounded-md">
                    {data?.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className=" items-center bg-gray-800 px-2 py-1 flex ">
            <input
              className="w-full rounded-l-2xl focus:outline-none bg-gray-700 text-white placeholder-gray-400 p-2"
              type="text"
              value={messageText}
              placeholder="Type your message..."
              onChange={(e) => setMessageText(e.target.value)}
              autoFocus
            />
            <div className="w-12 bg-black py-2 rounded-r-2xl flex items-center justify-center">
              <IoSend
                onClick={sendMessage}
                className="cursor-pointer text-2xl text-white"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
