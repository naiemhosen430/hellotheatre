import Image from "next/image";
import React from "react";
import Slider from "react-slick";

const CetagorySlider = ({ items, count }) => {
  return (
    <div style={{ width: "300px", overflow: "hidden" }}>
      <Slider
        auto={true}
        autoInterval={3000}
        items={items.map((item, i) => (
          <div key={i} className="h-[50px] w-[50px] ">
            <Image src={item?.image} alt="" height={500} width={500} />
            <p>{item?.name}</p>
          </div>
        ))}
        visibleItems={count}
      />
    </div>
  );
};

export default CetagorySlider;
