"use client";
import { getCookie, getCookies } from "cookies-next";
import { createContext, useEffect, roomeducer, useReducer } from "react";
import { getApiCall } from "@/api/fatchData";

export const RoomContex = createContext();

const roomReducer = (roomState, action) => {
  switch (action.type) {
    case "ADD_ALLROOM_DATA":
      return { ...roomState, room: action.payload };

    case "ADD_JOINEDROOM_DATA":
      // Log the users from the action payload for debugging

      // Ensure `action.payload` exists and has a `users` property
      const data_users = action.payload?.users || [];
      return {
        ...roomState,
        joinedroom: action.payload,
        room_members: [...data_users],
      };

    case "ADD_NEWMEMBER":
      const users = roomState?.room_members || [];
      const existUser = users.find(
        (user) => user[0]?.user_id === action.payload?.user_id
      );
      if (!existUser) {
        const new_member_objs = action.payload;
        return {
          ...roomState,

          room_members: [...roomState?.room_members, [new_member_objs]],
        };
      }
      return roomState;

    case "REMOVE_NEWMEMBER":
      const all_member_objs = roomState.room_members?.filter(
        (suser) => suser[0]?.user_id !== action.payload?.user_id
      );

      return {
        ...roomState,
        room_members: [...all_member_objs],
      };

    default:
      return roomState;
  }
};

export default function RoomContexProvider({ children }) {
  const token = getCookies("accesstoken");

  const [roomState, roomDispatch] = useReducer(roomReducer, {
    room: null,
    joinedroom: null,
    room_members: [],
  });

  useEffect(() => {
    if (token && !roomState?.room) {
      const fetchData = async () => {
        try {
          const response = await getApiCall("user");
          if (response?.statusCode === 200 && response?.data) {
            roomDispatch({ type: "ADD_ALLROOM_DATA", payload: response?.data });
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
