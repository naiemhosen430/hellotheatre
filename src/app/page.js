import Image from "next/image";
import VideoPlayer from "./_components/roomComponents/VideoPlayer";
import ButtomBar from "./_components/shared/ButtomBar";

export default function Home() {
  return (
    <>
      <div>
        <VideoPlayer />
        <ButtomBar />
      </div>
    </>
  );
}
