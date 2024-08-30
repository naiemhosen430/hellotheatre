"use client";
import { useContext, useState } from "react";
import VideoPlayer from "./_components/roomComponents/VideoPlayer";
import ButtomBar from "./_components/shared/ButtomBar";
import Authentication from "./_components/login/Authentication";
import { AuthContex } from "@/Contexts/AuthContex";
import { getCookie } from "cookies-next";

export default function Home() {
  const token = getCookie("accesstoken");
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

  if (!token) {
    return (
      <>
        <Authentication />
      </>
    );
  }

  return (
    <>
      <div>
        <VideoPlayer />
        <ButtomBar />
      </div>
    </>
  );
}
