import React from "react";
import { Container } from "react-bootstrap";
import { FaMicrophone } from "react-icons/fa";
import { FaMicrophoneSlash } from "react-icons/fa";
import { FaShare } from "react-icons/fa6";
import { RxExit } from "react-icons/rx";

export default function ButtomBar() {
  return (
    <>
      <div className="fixed bottom-0 w-full">
        <Container className="bg-black p-2 flex items-center justify-around">
          <span className="p-2 w-6/12 text-white lg:text-2xl font-bold text-lg">
            Naiem's Room
          </span>
          <button
            title="You are unmute now"
            className="p-2 text-white lg:text-2xl font-bold text-lg"
          >
            <FaMicrophone />
            {/* <FaMicrophoneSlash /> */}
          </button>
          <button
            title="Share this room"
            className="p-2 text-white lg:text-2xl font-bold text-lg"
          >
            <FaShare />
          </button>
          <button
            title="Leave this room"
            className="p-2 text-white lg:text-2xl font-bold text-lg"
          >
            <RxExit />
          </button>
        </Container>
      </div>
    </>
  );
}
