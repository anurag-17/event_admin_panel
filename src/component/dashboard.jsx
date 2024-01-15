import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

const Dashboard = () => {
  const [getAllEvent, setGetAllEvent] = useState([]);

  useEffect(() => {
    defaultEvent();
  }, []);

  const defaultEvent = () => {
    const option = {
      method: "GET",
      url: "/api/event/getStats",
    };
    axios
      .request(option)
      .then((response) => {
        setGetAllEvent(response?.data);
        console.log(response?.data, "count");
        setLoader(false);
      })
      .catch((err) => {
        console.log(err, "Error");
      });
  };

  return (
    <>
      <div>
        {/* ---------first--------- */}
        <div className="my-10">
          <h1 className="text-center text-[25px]  sm:text-[30px] md:text-[35px] lg:text-[35px] xl:text-[35px] 2xl:text-[45px] font-semibold text-gray-600">
            Welcome To Dashboard
          </h1>
        </div>
        {/* ---------second-------- */}
        {getAllEvent && (
          <div className="flex justify-around mt-16">
            <div className="flex justify-between border w-1/4 xl:h-[100px] 2xl:h-[120px] bg-white">
              <div className="relative w-1/2 ">
                <div className="absolute  bg-[#FD9912] w-1/2 lg:p-4 xl:p-5 rounded-md md:left-3 lg:left-3 xl:left-5 top-[-20px] 2xl:h-[85px] xl:h-auto lg:h-[50px] md:h-[50px] ">
                  <div className="flex ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-7 h-7  mt-[14px] lg:mt-0 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-7 xl:h-7 2xl:w-10 2xl:h-10 text-white mx-auto items-center"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className=" w-1/2 ">
                <h2 className="font-semibold mt-2 text-[14px] lg:text-[12px] xl:text-[14px] 2xl:text-[22px] text-gray-400">
                  Total Events{" "}
                </h2>
                <h3 className="font-semibold text-[25px] lg:text-[22px] xl:text-[25px] 2xl:text-[35px]">
                  {getAllEvent?.totalEvents}
                </h3>
              </div>
            </div>

            <div className="flex justify-between border w-1/4 bg-white">
              <div className="relative w-1/2">
                <div className="absolute bg-[#50AA54]  w-1/2 lg:p-4 xl:p-5 rounded-md md:left-3 lg:left-3 xl:left-5 top-[-20px] 2xl:h-[85px] xl:h-auto lg:h-[50px] md:h-[50px] ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-7 h-7 mt-[14px] lg:mt-0 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-7 xl:h-7 2xl:w-10 2xl:h-10 text-white mx-auto"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                    />
                  </svg>
                </div>
              </div>
              <div className=" w-1/2 ">
                <h2 className="font-semibold mt-2 text-[14px] lg:text-[12px] xl:text-[14px] 2xl:text-[22px] text-gray-400">
                  Total Category{" "}
                </h2>
                <h3 className="font-semibold text-[25px] lg:text-[22px] xl:text-[25px] 2xl:text-[35px]">
                  {getAllEvent?.totalCategories}
                </h3>
              </div>
            </div>

            <div className="flex justify-between border w-1/4 bg-white">
              <div className="relative w-1/2">
                <div className="absolute bg-[#EB4844]  w-1/2 lg:p-4 xl:p-5 rounded-md md:left-3  lg:left-3 xl:left-5 top-[-20px] 2xl:h-[85px] xl:h-auto lg:h-[50px] md:h-[50px] ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-7 h-7 mt-[14px] lg:mt-0 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-7 xl:h-7 2xl:w-10 2xl:h-10 text-white mx-auto"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                    />
                  </svg>
                </div>
              </div>
              <div className=" w-1/2 ">
                <h2 className="font-semibold mt-2 text-[14px] lg:text-[12px] xl:text-[14px] 2xl:text-[22px] text-gray-400">
                  Total SubCategory{" "}
                </h2>
                <h3 className="font-semibold text-[25px] lg:text-[22px] xl:text-[25px] 2xl:text-[35px]">
                  {getAllEvent?.totalSubCategories}
                </h3>
              </div>
            </div>

            {/* <div className="flex justify-between border w-1/4 bg-white">
              <div className="relative w-1/2">
                <div className="absolute bg-[#13B9CD]  w-1/2 lg:p-4 xl:p-5 rounded-md md:left-3  lg:left-3 xl:left-5 top-[-20px] 2xl:h-[85px] xl:h-auto lg:h-[50px] md:h-[50px] ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-7 h-7 mt-[14px] lg:mt-0 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-7 xl:h-7 2xl:w-10 2xl:h-10 text-white mx-auto"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                    />
                  </svg>
                </div>
              </div>
              <div className=" w-1/2 ">
                <h2 className="font-semibold mt-2 text-[14px] lg:text-[12px] xl:text-[14px] 2xl:text-[22px] text-gray-400">
                  Total Provider{" "}
                </h2>
                <h3 className="font-semibold text-[25px] lg:text-[22px] xl:text-[25px] 2xl:text-[35px]">
                 3
                </h3>
              </div>
            </div> */}

          </div>
        )}
        <div className="flex my-10 xl:my-10 2xl:my-32">
          <div className="mx-auto w-1/3">
            <img
              src="/sterna-logo.png"
              alt="me"
              width="40"
              height="40"
              className="mt-10 w-[50%] sm:w-[50%]  md:w-full"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
