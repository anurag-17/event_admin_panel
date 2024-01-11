import React from "react";

const ImageModal = ({ data }) => {
  return (
    <div className={`grid  gap-5 justify-center items-center text-center ${data?.length>2? "grid-cols-3":""}`}>
      {data?.length > 0 &&
        data.map((img, inx) => (
          // <div className="w-full">
            <img src={img?.url} alt="event" className="mx-auto"/>
          // </div>
        ))}
    </div>
  );
};

export default ImageModal;
