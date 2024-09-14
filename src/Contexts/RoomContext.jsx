"use client";
import { getCookie, getCookies } from "cookies-next";
import { createContext, useEffect, roomeducer, useReducer } from "react";
import { getApiCall } from "@/api/fatchData";

export const RoomContex = createContext();

const roomReducer = (roomState, action) => {
  switch (action.type) {
    case "ADD_ALLROOM_DATA":
      console.log({ hello: action.payload });
      return { ...roomState, room: action.payload };

    case "ADD_JOINEDROOM_DATA":
      return { ...roomState, joinedroom: action.payload };

    case "ADD_NEWMEMBER":
      const users = roomState?.joinedroom?.users || [];

      if (!users.includes(action.payload?.socketid)) {
        const updatedUsers = [...users, action.payload?.socketid];
        const new_member_objs = {
          socket_id: action.payload?.socketid,
          user_id: action.payload?.user_id,
        };
        return {
          ...roomState,
          joinedroom: {
            ...roomState.joinedroom,
            users: updatedUsers,
          },
          room_members: [...roomState?.room_members, new_member_objs],
        };
      }
      return roomState;

    case "REMOVE_NEWMEMBER":
      const all_users =
        roomState?.joinedroom?.users?.filter(
          (user) => user !== action.payload?.socketid
        ) || [];

      const all_member_objs = roomState?.room_members?.filter(
        (suser) => suser?.socket_id !== action.payload?.socketid
      );

      return {
        ...roomState,
        joinedroom: {
          ...roomState.joinedroom,
          users: all_users,
        },
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
