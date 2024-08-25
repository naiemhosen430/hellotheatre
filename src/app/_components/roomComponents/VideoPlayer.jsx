"use client";
import React, { useState, useRef } from "react";
import { Container } from "react-bootstrap";
import { RxAvatar } from "react-icons/rx";

export default function VideoPlayer() {
  const [videoId, setVideoId] = useState("TlC_NCowUuQ");
  const [errorData, setErrorData] = useState("");
  const inputRef = useRef(null);

  const handleVideoChange = (url) => {
    try {
      const urlObj = new URL(url);
      // Check if the hostname is YouTube
      if (!["www.youtube.com", "youtu.be"].includes(urlObj.hostname)) {
        console.log("Invalid URL. Please enter a valid YouTube URL.");
        return;
      }

      const videoId =
        urlObj.searchParams.get("v") || urlObj.pathname.split("/").pop();
      setVideoId(videoId);
      setErrorData("");
    } catch (error) {
      setErrorData("Invalid URL. Please enter a valid YouTube URL.");
    }
  };

  const handleDefaultVideo = () => {
    setVideoId("TlC_NCowUuQ");
    if (inputRef.current) {
      inputRef.current.value = ""; // Clear the input field
    }
  };

  return (
    <Container>
      <div className="lg:flex">
        <div className="w-12/12 lg:w-8/12">
          <h1 className="p-2 text-slate-400 bg-slate-800">Movie Theatre</h1>
          <div className="border-2 border-x-sky-950">
            <iframe
              id="youtubePlayer"
              className="lg:max-h-[400px] max-h-[250px]"
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=1&controls=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>

            {errorData && (
              <p className="text-white text-[10px] px-2">{errorData}</p>
            )}
            <div className="suggestions px-2 flex items-center">
              <input
                type="text"
                placeholder="Enter YouTube URL"
                ref={inputRef}
                className="w-8/12 p-2 m-1 lg:text-sm text-[10px] rounded-md bg-slate-700 text-white"
                onChange={(e) => handleVideoChange(e.target.value)}
              />
              <button
                className="bg-slate-700 w-4/12 text-white px-2 py-2 m-1 rounded-xl lg:text-sm text-[10px]"
                onClick={handleDefaultVideo}
              >
                Play Default Video
              </button>
            </div>
          </div>
        </div>

        <div className="w-12/12 lg:w-4/12">
          <h1 className="p-2 text-slate-400 bg-slate-800">People (12)</h1>
          <div className="p-4 px-2">
            <div className="flex">
              <div className="flex p-2 text-white justify-center">
                <RxAvatar className="text-5xl" />
              </div>
              <div className="p-2">
                <div className="shadow-2xl bg-slate-700 text-white flex items-center justify-center border p-2 rounded-xl">
                  Hello, the movie sign is awesome
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
