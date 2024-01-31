"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from "../../../component/loader";
import {useAuth} from "../../../contexts/AuthContext"

const GetaEvent = ({ params }) => {
  const router = useRouter();
  const eventIssue = params?.slug || "";
  const [isLoader, setLoader] = useState(false);
  const [getaEvent, setGetaEvent] = useState([]);
  const { adminAuthToken } = useAuth();

  useEffect(() => {
    defaultevent();
  }, []);

  const defaultevent = () => {
    setLoader(true);
    const option = {
      method: "POST",
      url: "/api/issue/getEventIssue",
      data: {
        id: eventIssue,
      },
      headers: {
        authorization: adminAuthToken,
      },
    };
    axios
      .request(option)
      .then((response) => {
        setGetaEvent(response?.data);
        setLoader(false);
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  return (
    <>
      {isLoader && <Loader />}

      <div>
        <div className="mt-2 lg:mt-3 xl:mt-4 2xl:mt-7 flex justify-between items-center 2xl:pt-4 2xl:px-10 border ml-10 mr-4 lg:mx-8  bg-white rounded-lg   2xl:h-[100px] xl:h-[70px] lg:h-[60px] md:h-[50px] sm:h-[45px] h-[45px]  xl:px-8 lg:px-5 md:px-4 sm:px-4 px-1 2xl:text-2xl xl:text-[18px] lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px]">
          <h2 className="font-semibold">Event Detail </h2>
          <h2>Welcome Back, Admin</h2>
        </div>
        <div>
          <div className="border ml-10 mr-4 lg:mx-8 rounded-lg my-5">
            {getaEvent && (
              <div>
                <div className="flex my-3 lg:my-5">
                  <img
                    src={getaEvent?.event?.images[0]?.url}
                    alt="eventImage"
                    className="mx-auto w-40 sm:w-48 md:w-52 lg:w-72 xl:w-auto"
                  />
                </div>
                <div className=" text-center">
                  <h1 className="my-1 font-bold text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[22px] 2xl:[25px]">
                    {" "}
                    {getaEvent?.event?.name}{" "}
                  </h1>
                  <h1 className="my-1 h1_text_issue">
                    {" "}
                    {getaEvent?.event?.startDate} - {getaEvent?.event?.endDate}{" "}
                  </h1>
                  <h1 className="my-1 h1_text_issue">
                    Location : {getaEvent?.event?.location}{" "}
                  </h1>
                  <h1 className="my-1 h1_text_issue">
                    City : {getaEvent?.event?.city}{" "}
                  </h1>
                  <h1 className="my-1 h1_text_issue">
                    Country : {getaEvent?.event?.country}{" "}
                  </h1>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GetaEvent;
