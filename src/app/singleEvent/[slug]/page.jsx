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
      <div className="bg-[#F3F3F3] p-10 h-screen">
        <div className="bg-white border rounded-md border-gray-500 p-4">
          <div>
            <div className="font-bold text-[24px] flex justify-center mb-8">
              Event Details
            </div>
            <div className="flex bg-gray-100 p-4 rounded gap-5">
              <div>
                {eventDetails && (
                  <div className="flex gap-4">
                    <div className="w-72">
                      {/* <img src={eventDetails?.images[0]?.url} className="w-72" alt="Event" /> */}
                      {/* Carousel */}
                      <Carousel>
                        {eventDetails.images.map((image, index) => (
                          <div key={index}>
                            <img
                              src={image.url}
                              alt={`Image ${index + 1}`}
                              className="rounded-md"
                            />
                          </div>
                        ))}
                      </Carousel>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex gap-3 border border-gray-400 p-3 text-[22px] rounded-md ">
                  <p className="w-20">Title:</p>
                  <div>{eventDetails?.name}</div>
                </div>
                <div className="flex">
                  <p className="w-26 mr-2">Description:</p>
                  <div>{eventDetails?.description}</div>
                </div>
                <div className="flex">
                  <p className="w-24">Category:</p>
                  {eventDetails && eventDetails.category ? (
                    <div>{eventDetails.category.title}</div>
                  ) : (
                    <div>Category not allotted</div>
                  )}
                </div>
                <div className="flex ">
                  <p className="w-24">Venue:</p>
                  <div>{eventDetails?.location}</div>
                </div>
                <div className="flex ">
                  <p className="w-24">Date:</p>
                  <div>{eventDetails?.startDate}</div>
                </div>
                <div className="flex justify-center">
                  <button className="cursor-pointer hover:text-white text-[20px] border border-gray-400 px-14 py-2 rounded-md hover:bg-gray-500">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleEventPage;
