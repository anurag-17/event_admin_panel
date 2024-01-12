import React from "react";
import { Carousel } from "react-responsive-carousel";

const ImageModal = ({ data }) => {
  return (
    <div>
    {/* <div
      className={`grid  gap-5 justify-center items-center text-center ${
        data?.length > 2 ? "grid-cols-3" : ""
      }`}
    > */}
      {/* {data?.length > 0 &&
        data.map((img, inx) => (
          // <div className="w-full">
          <img src={img?.url} alt="event" className="mx-auto" />
          // </div>
        ))} */}
      <Carousel>
        {data.map((image, index) => (
          <div key={index}>
            <img src={image?.url} alt={`Image ${index + 1}`} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageModal;
