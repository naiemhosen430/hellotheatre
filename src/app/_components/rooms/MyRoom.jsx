"use client";
import VideoPlayer from "../roomComponents/VideoPlayer";
import { Container } from "react-bootstrap";
import Stage from "../roomComponents/Stage";

export default function MyRoom() {
  const localAudioRef = null;
  return (
    <>
      <Container className="bg-black h-screen px-0">
        <div>
          <VideoPlayer localVideoRef={localAudioRef} />
        </div>
        <div>
          <Stage />
        </div>
      </Container>
    </>
  );
}
