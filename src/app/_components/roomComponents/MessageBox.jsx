"use client";
import socket from "@/api/connectIo";
import React, { useContext, useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { BiMessageRoundedDots } from "react-icons/bi";
import { AuthContex } from "@/Contexts/AuthContex";
import Image from "next/image"; // Ensure this import if you are using Next.js

const handleSubboxClick = (event) => {
  event.stopPropagation();
};

export default function MessageBox() {
  const [messageData, setMessageData] = useState([]);
  const [messageText, setMessageText] = useState("");
  const { state } = useContext(AuthContex);
  const userData = state?.user;
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    socket.on("message-receive", (data) => {
      setMessageData((prevData) => [...prevData, data]);
    });
    return () => {
      socket.off("message-receive");
    };
  }, []);

  const sendMessage = () => {
    socket.emit("message-sent", {
      name: userData?.fullname,
      message: messageText,
    });
    setMessageText("");
  };

  console.log(messageData);
  return (
    <>
      <div className="relative z-[100] rounded-t-2xl overflow-hidden shadow-teal-800 bg-slate-900 bottom-0 w-full h-[80vh]">
        {focused && (
          <div
            onClick={() => setFocused(false)}
            className="h-screen z-[150] w-screen bg-transparent fixed items-end"
          >
            <div
              onClick={handleSubboxClick}
              className="sticky bottom-0 bg-slate-800 px-2 p-1 flex items-center"
            >
              <input
                className="w-11/12 rounded-l-2xl"
                type="text"
                value={messageText}
                name="message"
                autoFocus
                onChange={(e) => setMessageText(e.target.value)}
              />
              <div className="w-1/12 rounded-r-2xl bg-black">
                <IoSend
                  onClick={sendMessage}
                  className="cursor-pointer text-xl text-white"
                />
              </div>
            </div>
          </div>
        )}
        <div className="overflow-y-auto h-full">
          {messageData.map((data, i) => (
            <div key={i} className="flex">
              <Image
                className="object-fit w-[40px] h-[40px] m-auto rounded-full"
                width={500}
                height={500}
                src={data?.profilephoto || "default.jpeg"}
                alt=""
              />
              <p className="text-wrap bg-blue-900 p-1 px-2">{data?.message}</p>
            </div>
          ))}
        </div>
        <div className="absolute px-1 bottom-2 w-full flex items-center">
          <div className="pr-1">
            <div
              onClick={() => setFocused(true)}
              className="cursor-pointer px-2 flex items-center bg-blue-700 text-white rounded-2xl"
            >
              <BiMessageRoundedDots className="inline-block text-[10px] m-1" />
              <p className="pl-1 text-[10px]">Send message</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
