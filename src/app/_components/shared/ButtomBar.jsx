"use client";
import React from "react";
import { Container } from "react-bootstrap";
import { FaMicrophone } from "react-icons/fa";
import { FaMicrophoneSlash } from "react-icons/fa";
import { FaShare } from "react-icons/fa6";
import { RxExit } from "react-icons/rx";
import { useContext, useState } from "react";
import { AuthContex } from "@/Contexts/AuthContex";

export default function ButtomBar({ roomName }) {
  const { state, dispatch } = useContext(AuthContex);
  const userData = state?.user;
  return (
    <>
      {userData && (
        <div className="fixed bottom-0 w-full">
          <Container className="bg-black p-2 flex items-center justify-around">
            <span className="p-2 w-6/12 text-white lg:text-2xl font-bold text-lg">
              {userData?.username}
            </span>

            {/* <div className="flex items-center justify-end">
              <button
                title="You are unmute now"
                className="p-2 text-white lg:text-2xl font-bold text-lg"
              >
                <FaMicrophone />
                <FaMicrophoneSlash />
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
            </div> */}
            <div className="flex items-center justify-end">
              <button
                title="You are unmute now"
                className="p-2 px-3 white text-slate-300 bg-red-900 rounded-md mx-2 lg:text-xl text-sm font-bold "
              >
                Join
              </button>
              <button
                title="Share this room"
                className="p-2 px-3 white text-slate-300 bg-red-600 rounded-md mx-2 lg:text-xl text-sm font-bold "
              >
                Your Room
              </button>
            </div>
          </Container>
        </div>
      )}
    </>
  );
}
