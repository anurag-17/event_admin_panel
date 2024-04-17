"use client";
import React, { useState, Fragment } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

import Category from "../../../component/admin/category";
import SubCategoryPage from "../../../component/admin/sub-category/index";
import Event from "../../../component/admin/event/index";
import UpadatePassword from "../../../component/admin/setting/upadate-password";
import Loader from "../../../component/loader";
import Dashboard from "../../../component/dashboard";
import AllUser from "../../../component/admin/users";
import UserIssue from "../../../component/admin/user-issue/index";
import { useAuth } from "../../../contexts/AuthContext";

import dashboard from "../../../../public/images/dashboard.svg";
import eventlist from "../../../../public/images/event-list.svg";
import inquiry from "../../../../public/images/close-white.svg";
import eventadd from "../../../../public/images/event-add.svg";
import alluser from "../../../../public/images/users-2.svg";
import setting from "../../../../public/images/setting.svg";
import issue from "../../../../public/images/issue.svg";
import protectedRoute from "../../../component/utils/withAuth";
import Setting from "../../../component/admin/setting/Setting";
import EventRedirection from "../../event-table/page";
import redirect from "../../../../public/images/redirect.svg";

const AdminDashboard = () => {
  const { loader, handleSignout } = useAuth();
  const [ComponentId, setComponentId] = useState(1);
  const [showDrawer, setShowDrawer] = useState("");

  const handleClick = (id) => {
    setComponentId(id);
    setShowDrawer(false);
  };

  const signoutFunc = () => {
    handleSignout(
      (message) => toast.success(message),
      (message) => toast.error(message)
    );
  };

  const menulist = [
    {
      id: 1,
      label: "Dashboard",
      component: <Dashboard />,
      icon: dashboard,
    },
    {
      id: 2,
      label: "Event",
      component: <Event />,
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
      label: "All Users",
      component: <AllUser />,
      icon: alluser,
    },
    {
      id: 6,
      label: "Users Issue",
      component: <UserIssue />,
      icon: issue,
    },
    {
      id: 7,
      label: "Event Redirection",
      component: <EventRedirection />,
      icon: redirect,
    },
    {
      id: 8,
      label: "Setting",
      component: <Setting />,
      icon: setting,
    },
  ];

  return (
    <>
      {loader && <Loader />}

      <section className="z-50 overscroll-none">
        <div className="flex lg:static ">
          <div
            className="py-1 md:py-0 px-3 absolute top-2 md:top-4 flex flex-col gap-[5px] cursor-pointer lg:hidden"
            onClick={() => setShowDrawer(true)}
          >
            <div className="bg-black h-[2px] w-[20px]"></div>
            <div className="bg-black h-[2px] w-[20px]"></div>
            <div className="bg-black h-[2px] w-[20px]"></div>
          </div>
          <div
            className={`z-50 flex flex-col justify-between min-h-screen md:py-[10px] lg:py-[30px] xl:py-[10px] 2xl:py-[30px] py-[10px] text-white bg-black 
            xl:w-[22%] lg:w-[24%] md:w-[30%] sm:w-[35%] w-[50%]  drawer 
                 ${
                   showDrawer
                     ? "block  absolute top-0 left-0 min-h-screen is-show overflow-y-auto"
                     : "hidden lg:block"
                 }`}
          >
            <div
              className="relative text-white flex flex-col gap-[5px] cursor-pointer lg:hidden text-right mr-3 mt-2"
              onClick={() => setShowDrawer(false)}
            >
              <div className="flex justify-end">
                {" "}
                <Image src={inquiry} className=" sm:w-8  w-7" />{" "}
              </div>
            </div>

            <div className="">
              <div className="flex justify-center items-center lg:mt-4 xl:mt-5 2xl:mt-7 md:mt-2 mb-6 sm:mb-0">
                <div className="mx-auto w-2/3">
                  <img
                    src="/sterna-logo.png"
                    alt="me"
                    width="60"
                    height="60"
                    className=" w-[90%] "
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col 2xl:gap-6 gap-1 sm:mt-10 lg:mt-10 xl:mt-14 2xl:mt-20">
              {menulist.map((item, index) => (
                <div
                  key={index}
                  className={` pl-1 sm:pl-5 xl:pl-6 py-3 mx-3 xl:mx-5 rounded-md  flex gap-x-3 items-center cursor-pointer  transition-colors font-semibold dash-menu  hover:transition-all ease-in delay-100 duration-300  hover:bg-gray-700 2xl:text-[20px]  xl:text-[14px] lg:text-[12px] md:text-[14px] sm:text-[12px] text-[11px] dashboard_box_t 
                                    ${
                                      item.id === ComponentId
                                        ? "bg-gray-700"
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
                  onClick={signoutFunc}
                  className="lg:mt-5 xl:mt-7 2xl:mt-12 pl-1 sm:pl-5 xl:pl-6 py-3 mx-3 xl:mx-5 rounded text-center cursor-pointer my-3 flex items-center transition-colors dash-menu gap-x-3  font-semibold hover:bg-menu_secondary hover:text-white hover:rounded-md  hover:bg-gray-700 xl:text-[14px] 2xl:text-[20px] lg:text-[12px] md:text-[14px] sm:text-[12px] text-[11px] dashboard_box_t "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-[20px] w-[20px] xl:h-[20px] xl:w-[20px] 2xl:h-[30px] 2xl:w-[30px] "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                    />
                  </svg>

                  <p>Sign Out</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#f3f3f3] w-full overflow-y-auto">
            {menulist.map((item, index) => (
              <Fragment key={index}>
                {ComponentId === item.id && item.component}
              </Fragment>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default protectedRoute(AdminDashboard);
