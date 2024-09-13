import React from "react";

export default function OtherRoom() {
  return (
    <>
      <div className="fixed h-screen w-screen flex items-center justify-center z-50 top-0 left-0 bg-black">
        <video
          id="remoteVideo"
          autoPlay
          className="w-full h-full"
          style={{ backgroundColor: "black" }}
        ></video>
      </div>
    </>
  );
}
