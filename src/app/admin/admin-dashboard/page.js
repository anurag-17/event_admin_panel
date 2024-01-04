"use client";
import React from "react";
import { useState } from "react";
import dashboard from "../../../../public/images/dashboard.svg";
import eventadd from "../../../../public/images/event-add.svg";
import eventlist from "../../../../public/images/event-list.svg";
import setting from "../../../../public/images/setting.svg";
import inquiry from "../../../../public/images/close-square.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "../../../../public/images/sterna-logo.png";
import Category from "../../../component/admin/category";
import SubCategoryPage from "../../../component/admin/sub-category/index";
import Event from "../../../component/admin/event/index"
import { Fragment } from "react";

export const menulist = [
  {
    id: 1,
    label: "Dashboard",
    component: "",
    icon: dashboard,
  },
  {
    id: 2,
    label: "Event",
    component: <Event/>,
    icon: eventadd,
  },
  {
    id: 3,
    label: "Category",
    component: <Category />,
    icon: eventlist,
  },
  {
    id: 4,
    label: "Sub-Category",
    component: <SubCategoryPage />,
    icon: eventlist,
  },
  {
    id: 5,
    label: "Setting",
    component: "",
    icon: setting,
  },
];

const AdminDashboard = () => {
  const [ComponentId, setComponentId] = useState(1);
  const [showDrawer, setShowDrawer] = useState("");
  const [userToken, setUserToken] = useState(null);
  const router = useRouter();

  const handleClick = (id) => {
    setComponentId(id);
    setShowDrawer(false);
  };

  const handleSignout = () => {
    console.log("Logging out...");
    setUserToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userDetails");
    router.push("/admin");
  };

  return (
    <section className="z-0">
      <div className="flex min-h-screen relative lg:static ">
        <div
          className="py-2 px-3  absolute top-3 md:top-4 flex flex-col gap-[5px] cursor-pointer lg:hidden"
          onClick={() => setShowDrawer(true)}
        >
          <div className="bg-black h-[2px] w-[20px]"></div>
          <div className="bg-black h-[2px] w-[20px]"></div>
          <div className="bg-black h-[2px] w-[20px]"></div>
        </div>
        <div
          className={`flex flex-col justify-between min-h-screen md:py-[10px] lg:py-[30px] xl:py-[30px] 2xl:py-[50px] py-[10px] text-white bg-black 
        xl:w-[22%] lg:w-[23%] md:w-[30%] sm:w-[35%] w-[50%]  drawer
                 ${
                   showDrawer
                     ? "block  absolute top-0 left-0 min-h-screen is-show"
                     : "hidden lg:block"
                 }`}
        >
          <div
            className="relative text-white  flex flex-col gap-[5px] cursor-pointer lg:hidden  text-right mr-3 mt-2"
            onClick={() => setShowDrawer(false)}
          >
            <div className="flex justify-end">
              {" "}
              <Image src={inquiry} className="md:w-10 sm:w-8  w-7" />{" "}
            </div>
          </div>
         
          <div className="">
            <div className="flex justify-center items-center whitespace-pre-wrap lg:mt-4 xl:mt-5 2xl:mt-7 md:mt-2 mt-4">
              <h1 className="2xl:text-[30px] lg:text-[20px] md:text-[18px] sm:text-[16px] text-[14px] font-semibold  text-center whitespace-nowrap ">
                Admin Dashboard
              </h1>
            </div>
          </div>
          <div className="flex flex-col 2xl:gap-6 gap-1 mt-10 lg:mt-14 xl:mt-20 2xl:mt-28">
            {menulist.map((item, index) => (
              <div
                key={index}
                className={`sm:pl-6 py-3 mx-5 rounded-md  flex gap-x-3 items-center cursor-pointer  transition-colors font-semibold dash-menu  hover:transition-all ease-in delay-100 duration-300  hover:bg-gray-700 2xl:text-[25px] xl:text-[16px] lg:text-[14px] md:text-[14px] sm:text-[12px] text-[11px]  
                                    ${
                                      item.id === ComponentId
                                        ? "bg-menu_secondary"
                                        : "hover:menu_secondary hover:text-white hover:rounded-md"
                                    }  `}
                onClick={() => handleClick(item.id)}
              >
                <Image
                  src={item?.icon}
                  alt={item.label}
                  height={30}
                  width={30}
                  className="h-[20px] w-[20px] xl:h-[20px] xl:w-[20px] 2xl:h-[30px] 2xl:w-[30px] fill-white"
                />
                <p className=" capitalize whitespace-nowrap ">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="">
            <div>
              <div
                onClick={handleSignout}
                className="lg:mt-10 xl:mt-14 2xl:mt-24 sm:pl-6 py-3 mx-5 rounded text-center cursor-pointer my-3 flex items-center transition-colors dash-menu gap-x-3  font-semibold hover:bg-menu_secondary hover:text-white hover:rounded-md  hover:bg-gray-700 xl:text-[16px] 2xl:text-[25px] lg:text-[14px] md:text-[14px] sm:text-[12px] text-[11px]"
              >
                <p>Sign Out</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#f3f3f3] w-full">
          {menulist.map((item, index) => (
            <Fragment key={index}>
              {ComponentId === item.id && item.component}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
