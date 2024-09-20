import Image from "next/image";
import React from "react";
import Slider from "react-slick";
import UseRoomContext from "@/Hooks/UseRoomContext";

const TheatreSlider = ({ items, count }) => {
  const { joinRoomHandler } = UseRoomContext();
  
  // Slider settings
  const settings = {
    dots: false, // Remove dots
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: count,
    slidesToScroll: 1,
    cssEase: "ease-in-out",
  };

  // Ensure we have enough items for a seamless experience
  const slidesToShow = count < items.length ? count : items.length;

  return (
    <div style={{ width: "100%", margin: "auto" }}>
      <Slider {...settings}>
        {/* Duplicating items to create the infinite effect */}
        {items.concat(items).map((item, i) => (
          <div
            onClick={() => {
              joinRoomHandler(item?.username);
            }}
            key={i}
            className="relative overflow-hidden rounded-2xl mpx-5 w-3/12 lg:h-[200px] h-[100px]"
          >
            <Image
              className="relative w-full lg:h-[200px] h-[100px]"
              src={item?.image || "/default.jpeg"}
              alt={item?.name || "Theatre item"}
              height={500}
              width={500}
            />
            <p className="absolute top-0 left-0 h-full w-full flex items-end p-2 lg:pb-4 pb-2 bg-black/50 lg:text-[20px] text-[10px] text-white">
              {item?.tittle}
            </p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TheatreSlider;
