import React from "react";
import Image from "next/image";

const Dashboard = () => {
  return (
    <>
      <div className="flex justify-center my-auto h-screen">
        <div className="">
          <div className="flex mx-auto my-16 xl:my-20 2xl:my-32">
            <h1 className="mx-auto text-[25px] sm:text-[30px] md:text-[35px] lg:text-[35px] xl:text-[35px] 2xl:text-[45px] font-semibold text-gray-600">
              Welcome To Dashboard
            </h1>
          </div>
          <div>
            <img src="/sterna-logo.png" alt="me" width="64" height="64" className="mx-auto w-[50%] sm:w-[50%] md:w-[60%] lg:w-[60%] xl:w-[60%] 2xl:w-[90%]"/>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
