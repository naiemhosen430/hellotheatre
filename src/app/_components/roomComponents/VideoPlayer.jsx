"use client";
import React, { useState, useRef } from "react";
import { Container } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";

export default function VideoPlayer() {
  const [videoId, setVideoId] = useState("TlC_NCowUuQ"); // Default YouTube video ID
  const [videoUrl, setVideoUrl] = useState(null); // For local video playback
  const [errorData, setErrorData] = useState("");
  const inputRef = useRef(null);
  const fileInputRef = useRef(null); // Ref for the hidden file input

  // Handles YouTube URL input
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
      setVideoUrl(null); // Clear local video URL
      setErrorData("");
    } catch (error) {
      setErrorData("Invalid URL. Please enter a valid YouTube URL.");
    }
  };

  // Handles file input
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoUrl(URL.createObjectURL(file));
      setVideoId(""); // Clear YouTube video ID
      setErrorData("");
    }
  };

  // Trigger the file input click
  const handlePlayFromDevice = () => {
    fileInputRef.current.click(); // Programmatically click the file input
  };

  // Clear the file input and video URL
  const handleDefaultVideo = () => {
    inputRef.current.value = ""; // Clear the input field
    setVideoUrl(null); // Clear local video URL
    setVideoId(""); // Clear YouTube video ID
  };

  return (
    <div className="lg:flex">
      <div className="w-12/12 lg:w-8/12">
        <div className="p-2 text-slate-400 font-bold bg-slate-800">
          <h1>Hello Theatre</h1>
          <p className="text-[5px] text-blue-500">Produced by NanAi</p>
        </div>
        <div className="border-2 border-x-sky-950">
          {/* Conditionally render iframe or video element based on source */}
          {videoUrl ? (
            <video
              width="100%"
              height="500"
              controls
              className="lg:max-h-[400px] max-h-[250px]"
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <iframe
              id="youtubePlayer"
              className="lg:max-h-[400px] max-h-[250px]"
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&rel=0&controls=1&modestbranding=0&iv_load_policy=3&fs=1&playsinline=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="autoplay"
              allowFullScreen
            ></iframe>
          )}

          {errorData && (
            <p className="text-white text-[10px] px-2">{errorData}</p>
          )}
          <div className="suggestions overflow-hidden overflow-y-auto px-2 flex items-center">
            <input
              type="text"
              placeholder="Enter YouTube URL"
              ref={inputRef}
              className="w-6/12 p-2 m-1 lg:text-sm text-[10px] rounded-md bg-slate-700 text-white"
              onChange={(e) => handleVideoChange(e.target.value)}
            />
            <button
              className="bg-slate-700 w-4/12 text-white px-2 py-2 m-1 rounded-xl lg:text-sm text-[10px]"
              onClick={handleDefaultVideo}
            >
              Clear Video
            </button>
            <button
              className="bg-slate-700 w-2/12 text-white px-2 py-2 m-1 text-center rounded-xl lg:text-2xl text-xl"
              onClick={handlePlayFromDevice}
            >
              <FaPlus />
            </button>
            <input
              type="file"
              accept="video/*"
              ref={fileInputRef} // Reference to the hidden file input
              onChange={handleFileChange}
              className="hidden" // Hide the file input
            />
          </div>
        </div>
      </div>

      <div className="w-12/12 lg:w-4/12">
        <h1 className="p-2 text-slate-400 bg-slate-800">People (12)</h1>
        <div className="p-4 px-2">
          <div className="flex">
            <div className="flex p-2 text-white justify-center">
              <RxAvatar className="lg:text-5xl text-4xl" />
            </div>
            <div className="p-2">
              <div className="shadow-2xl lg:text-sm text-[10px] bg-black text-white flex items-center justify-center border-blue-500 p-2 px-3 border rounded-xl">
                Hey there, this project is still under construction
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
