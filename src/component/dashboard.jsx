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
        setGetAllEvent(response.data);
        console.log(response.data, "count");
        setLoader(false);
      })
      .catch((err) => {
        console.log(err, "Error");
      });
  };

  return (
    <>
      <div className="flex">
        <div className="mt-28 xl:mt-40 2xl:w-1/4 2xl:mt-60">
          {getAllEvent && (
            <div className=" text-gray-600 ">
              <div className="dashboard_div ">
                <h2 className="font-semibold mt-2 text-[16px]">
                  Total Events{" "}
                </h2>
                <div>
                  <div>
                    <h3 className="font-semibold text-[16px]">
                      {getAllEvent.totalEvents}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="dashboard_div">
                <h2 className="font-semibold mt-2 text-[16px]">
                  Total Category{" "}
                </h2>
                <h3 className="font-semibold text-[16px]">
                  {getAllEvent.totalCategories}
                </h3>
              </div>

              <div className="dashboard_div">
                <h2 className="font-semibold mt-2 text-[16px]">
                  Total SubCategory{" "}
                </h2>
                <h3 className="font-semibold text-[16px]">
                  {getAllEvent.totalSubCategories}
                </h3>
              </div>
            </div>
          )}

          <div className=" text-gray-600 ">
            <div className=" dashboard_div">
              <h2 className="font-semibold mt-2 text-[16px]">Total Provider</h2>
              <h3 className="font-semibold text-[16px]">3</h3>
            </div>
          </div>
        </div>
        <div className=" mx-auto my-20 xl:my-24 2xl:my-32">
          <div>
            <h1 className="mx-auto text-[25px] sm:text-[30px] md:text-[35px] lg:text-[35px] xl:text-[35px] 2xl:text-[45px] font-semibold text-gray-600">
              Welcome To Dashboard
            </h1>
          </div>
          <div>
            <img
              src="/sterna-logo.png"
              alt="me"
              width="64"
              height="64"
              className="mt-10 w-[50%] sm:w-[50%] md:w-[60%] lg:w-[60%] xl:w-[60%] 2xl:w-[90%]"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
