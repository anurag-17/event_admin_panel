import React from "react";
import logo from "../../public/images/sterna-logo.png";
import Image from "next/image";

const Dashboard = () => {
  return (
    <>
      <div className="flex justify-center my-auto h-screen">
        <div className="">
          <div className="flex mx-auto my-16 xl:my-20 2xl:my-32">
            <h1 className="mx-auto lg:text-[35px] xl:text-[35px] 2xl:text-[45px] font-semibold text-gray-600">Welcome To Dashboard</h1>
          </div>
          <div>
            <Image src={logo} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
