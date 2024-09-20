"use client";
import { AuthContex } from "@/Contexts/AuthContex";
import Link from "next/link";
import React, { useContext } from "react";
import { Container } from "react-bootstrap";

export default function Header() {
  const { state } = useContext(AuthContex);
  const userData = state?.user;
  return (
    <>
      {userData && (
        <Container className="flex items-center bg-[#46007C] p-3 justify-between">
          <div>
            <h1 className="font-[600] text-white leading-[10px] text-[25px]">
              HelloTheatre
            </h1>
          </div>
          <div>
            <Link href={"/profile"}>
              <div className="h-[45px] w-[45px] bg-white rounded-full flex items-center justify-center font-bold text-black text-[14px]">
                {userData?.fullname?.slice(0, 5)}
              </div>
            </Link>
          </div>
        </Container>
      )}
    </>
  );
}
