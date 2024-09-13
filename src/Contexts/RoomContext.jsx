"use client";
import { getCookie, getCookies } from "cookies-next";
import { createContext, useEffect, roomeducer, useReducer } from "react";
import { getApiCall } from "@/api/fatchData";

export const RoomContex = createContext();

const roomReducer = (roomState, action) => {
  switch (action.type) {
    case "ADD_AllROOM_DATA":
      return { ...roomState, room: action.payload };
    case "ADD_JOINEDROOM_DATA":
      return { ...roomState, joinedroom: action.payload };
    case "ADD_NEWMEMBER":
      const newData = roomState?.joinedroom?.users?.push(action.payload);
      return { ...roomState, joinedroom: newData };
    default:
      return roomState;
  }
};

export default function RoomContexProvider({ children }) {
  const token = getCookies("accesstoken");

  const [roomState, roomDispatch] = useReducer(roomReducer, {
    room: null,
    joinedroom: null,
  });

  useEffect(() => {
    if (token && !roomState?.room) {
      const fetchData = async () => {
        try {
          const response = await getApiCall("user");
          if (response?.statusCode === 200 && response?.data) {
            roomDispatch({ type: "ADD_AllROOM_DATA", payload: response?.data });
          }
        } catch (error) {}
      };

      fetchData();
    }
  }, [token, roomState]);

  return (
    <RoomContex.Provider value={{ roomState, roomDispatch }}>
      {children}
    </RoomContex.Provider>
  );
}
