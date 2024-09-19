"use client";
import { Container } from "react-bootstrap";
import DisplayHostVideo from "../roomComponents/DisplayHostVideo";

export default function OtherRoom() {
  return (
    <>
      <Container className="bg-black h-screen px-0">
        <div>
          <DisplayHostVideo />
        </div>
      </Container>
    </>
  );
}
