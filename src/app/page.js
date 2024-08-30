"use client";
import { useContext, useState } from "react";
import VideoPlayer from "./_components/roomComponents/VideoPlayer";
import ButtomBar from "./_components/shared/ButtomBar";
import Authentication from "./_components/login/Authentication";
import { AuthContex } from "@/Contexts/AuthContex";

export default function Home() {
  const { state, dispatch } = useContext(AuthContex);
  const userData = state?.user;
  // State for managing room name
  const [roomName, setRoomName] = useState("");

  // State for managing input value
  const [inputValue, setInputValue] = useState("");

  // Handle input change
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Handle button click
  const handleButtonClick = () => {
    setRoomName(inputValue);
    setInputValue("");
  };

  if (!userData) {
    return (
      <>
        <Authentication />
      </>
    );
  }

  return (
    <>
      {!roomName && (
        <div className="fixed top-0 left-0 h-screen w-screen bg-black/50 flex items-center justify-center">
          <div className="lg:w-5/12 bg-black p-5 rounded-xl shadow-xl">
            <h1 className="text-xl text-slate-400 font-bold py-2 lg:text-3xl">
              Set your room name
            </h1>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="w-full my-4 p-2 mb-4 bg-gray-800 text-white rounded"
              placeholder="Enter room name"
            />
            <button
              onClick={handleButtonClick}
              className="w-full p-2 mt-4 bg-blue-900 text-white rounded"
            >
              Set {inputValue ? inputValue : "Room Name"}
            </button>
          </div>
        </div>
      )}
      <div>
        <VideoPlayer />
        <ButtomBar roomName={roomName} />
      </div>
    </>
  );
}
