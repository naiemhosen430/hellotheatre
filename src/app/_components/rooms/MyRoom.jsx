import React from "react";
import VideoPlayer from "../roomComponents/VideoPlayer";

export default function MyRoom({ setJoinedMyRoomState }) {
  return (
    <>
      <div className="fixed top-0 left-0 bg-black w-full h-screen">
        <div>
          <VideoPlayer setJoinedMyRoomState={setJoinedMyRoomState} />
        </div>
      </div>
    </>
  );
}
