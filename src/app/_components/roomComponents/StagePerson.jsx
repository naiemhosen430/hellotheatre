"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { getApiCall } from "@/api/fatchData";

export default function StagePerson({ id }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Define the async function inside useEffect
    const fetchUserData = async () => {
      try {
        const response = await getApiCall(`user/${id}`);
        if (response?.statusCode === 200 && response?.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUserData();
  }, [id]);

  console.log({ user });
  if (!user) {
    return <div>Loading...</div>; // Optionally handle the loading state
  }

  return (
    <div className="w-[70px] h-[70px] rounded-full border-2 bg-red-900 border-blue-500">
      <Image
        className="object-fit w-[70px] h-[70px] m-auto rounded-full"
        width={500}
        height={500}
        src={`/${user?.profilephoto}`}
        alt={""}
      />
      <p className="text-[8px] flex-shrink-0 bg-blue-500 rounded-2xl p-1 px-2 mt-[2px] text-white">
        {user?.fullname?.slice(0, 10)}
      </p>
    </div>
  );
}
