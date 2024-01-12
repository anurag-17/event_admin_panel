"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const SingleEventPage = ({ params }) => {
  const router = useRouter();
  const event_id = params?.slug || "";
  console.log(event_id);

  const [eventDetails, setEventDetails] = useState(null);

  const singleEvent = async (event_id) => {
    try {
      const response = await axios.post("/api/event/getEvent", {
        id: event_id,
      });

      console.log("abc", response.data);
      setEventDetails(response.data);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  useEffect(() => {
    if (event_id) {
      singleEvent(event_id);
    }
  }, [event_id]);

  return (
    <>
      <div className="bg-[#F3F3F3] p-10">
        <div className="bg-white border border-gray-500 p-4">
          <div>
            <div className="font-bold text-[24px] flex justify-center">Event Details</div>
            {eventDetails && (
              <div className="flex gap-4">
                <div className="w-72">
                  {/* <img src={eventDetails?.images[0]?.url} className="w-72" alt="Event" /> */}
                  {/* Carousel */}
                  <Carousel>
                    {eventDetails.images.map((image, index) => (
                      <div key={index}>
                        <img src={image.url} alt={`Image ${index + 1}`} />
                      </div>
                    ))}
                  </Carousel>
                </div>

               
              </div>
            )}

           


          </div>
        </div>
      </div>
    </>
  );
};

export default SingleEventPage;
