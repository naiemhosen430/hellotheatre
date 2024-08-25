import Image from "next/image";
import React from "react";
import { Container } from "react-bootstrap";
import { RxAvatar } from "react-icons/rx";

export default function VideoPlayer() {
  return (
    <Container>
      <div className="lg:flex">
        <div className="w-12/12 lg:w-8/12">
          <h1 className="p-2 text-slate-400 bg-slate-800">Movie Theatre</h1>
          <div className="border-2 p-2 border-x-sky-950">
            <video
              id="videoPlayer"
              width="100%"
              controls
              className="rounded-md"
            >
              <source src="your-video-url.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        <div className="w-12/12 lg:w-4/12">
          <h1 className="p-2 text-slate-400 bg-slate-800">People (12)</h1>
          <div className="p-4 px-2">
            <div className="flex">
              <div className="flex p-2 text-white justify-center ">
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
