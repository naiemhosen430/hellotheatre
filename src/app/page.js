"use client";
import { useContext, useState, useEffect } from "react";
import VideoPlayer from "./_components/roomComponents/VideoPlayer";
import Authentication from "./_components/login/Authentication";
import { AuthContex } from "@/Contexts/AuthContex";
import { getCookie } from "cookies-next";
import TheatreCart from "./_components/roomComponents/TheatreCart";
import { RoomContex } from "@/Contexts/RoomContext";
import { Container } from "react-bootstrap";
import RoomLoaderCart from "./_components/loaders/RoomLoaderCart";
import { TbMoodSad } from "react-icons/tb";
import UseRoomContext from "@/Hooks/UseRoomContext";
import { IoSearch } from "react-icons/io5";
import CetagorySlider from "./_components/sliders/CetagorySlider.jsx";
import TheatreSlider from "./_components/sliders/TheatreSlider";

export default function Home() {
  const token = getCookie("accesstoken");
  const { state, dispatch } = useContext(AuthContex);
  const userData = state?.user;
  // State for managing room name
  const [roomName, setRoomName] = useState("");
  const { roomState, roomDispatch } = useContext(RoomContex);
  const rooms = roomState?.room;
  const { getAllRooms } = UseRoomContext();
  const [search_text, set_search_text] = useState("");
  const [all_rooms, set_all_rooms] = useState(null);

  // State for managing input value
  const [inputValue, setInputValue] = useState("");

  // Handle input change
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Handle button click
  const handleButtonClick = () => {
    setRoomName(inputValue);
    setInputValue("");
  };

  useEffect(() => {
    getAllRooms();
  }, []);

  useEffect(() => {
    if (search_text) {
      const searchedData = rooms?.filter((room) => {
        const text = `${room.fullname} ${room.username} ${room.tittle}`.toLowerCase(); 
        return text.includes(search_text.toLowerCase());
      });
      set_all_rooms(searchedData);
    } else {
      set_all_rooms(rooms);
    }
  }, [rooms, search_text]);

  if (!userData) {
    return (
      <>
        <div className="flex items-center h-screen bg-black justify-center">
          <div className="text-center">
            <div role="status">
              <svg
                aria-hidden="true"
                class="w-[100px] h-[100px] m-auto text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
            <h1 className="text-2xl text-white text-center py-4">
              HelloTheatre
            </h1>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Container className=" p-0 min-h-screen rounded-t-[20px] bg-gradient-to-t from-[#46007C] to-[#8000E2] overflow-y-auto">
        <div className="flex items-center">
          <input
            className="text-[14px] leading-[17.07px] w-full p-[18px] px-[18px] placeholder-white text-white font-[400] bg-[#6700B6] rounded-[20px]"
            value={search_text}
            name="search"
            onChange={(e) => set_search_text(e.target.value)}
            placeholder="Search Theatre..."
          />
          <IoSearch className="ml-[-40px] inline-block text-2xl text-white" />
        </div>

        <div classname="p-2 w-full overflow-hidden">
          {!search_text && (
            <>
              <span className="p-2 w-6/12 text-white lg:text-2xl font-bold text-lg">
                Welcome {userData?.fullname}
              </span>

              {/* for future use  */}
              {/* <div>
                <h1 className="text-[20px] leading-[24.38px] text-white font-[600]">
                  Category
                </h1>
                <div>
                  <CetagorySlider count={6} items={[]} />
                </div>
              </div> */}
              <div>
                <h1 className="text-[20px] p-2 pb-0 leading-[24.38px] text-white font-[600]">
                  Top Theatres
                </h1>
                <div className="p-2">
                  {all_rooms ? (
                    all_rooms?.length ? (
                      <>
                      <div className="hidden lg:block">
                      <TheatreSlider count={6} items={all_rooms} />
                      </div>
                      <div className="lg:hidden block">
                      <TheatreSlider count={4} items={all_rooms} />
                      </div>
                      </>
                    ) : (
                      <h1 className="text-white py-4 px-2">No top theatre</h1>
                    )
                  ) : (
                    <div className="flex items-center">
                      <div classname="p-5 loading mx-2 w-3/12"></div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="p-3 px-2">
            {all_rooms?.length === 0 && (
              <div className="text-center">
                <TbMoodSad className="text-[100px] text-blue-500 m-3 inline-block" />
                <h1 className="text-2xl text-blue-500 text-center">
                  No active room right now!
                </h1>
              </div>
            )}
            {all_rooms?.map((room) => (
              <div key={room._id} className="overflow-hidden">
                <TheatreCart room={room} />
              </div>
            ))}
            {!all_rooms && (
              <div>
                <RoomLoaderCart />
                <RoomLoaderCart />
                <RoomLoaderCart />
                <RoomLoaderCart />
                <RoomLoaderCart />
                <RoomLoaderCart />
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
