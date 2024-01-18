import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext"; 
import {  toast } from "react-toastify";




const Topbar = () => {
  const router = useRouter();
  const [isLoader, setLoader] = useState(false);
  const { loader, handleSignout } = useAuth();
  const { adminAuthToken } = useAuth();
    // const [token, setToken] = useState(
    //     typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
    //   );

    // useEffect(() => {
    //     const authToekn = token ? JSON.parse(token) : null;
    //     setToken(authToekn);
    //     if (!authToekn || authToekn == null) {
    //       router.push("/admin-login");
    //     }
    //   }, []);
      const signoutFunc = () => {
        handleSignout(
          (message) => toast.success(message),
          (message) => toast.error(message)
        );
      };
    
      // const handleSignout = () => {
      //   try {
      //     setLoader(true);
      //     const options = {
      //       method: "GET",
      //       url: `/api/auth/logout`,
      //       headers: {
      //         "Content-Type": "application/json",
      //         authorization: token,
      //       },
      //     };
      //     axios
      //       .request(options)
      //       .then((res) => {
      //         if (res.status === 200) {
      //           toast.success("Logout!");
      //           setLoader(false);
      //           localStorage.removeItem("accessToken");
      //           router.push("/admin-login");
      //         } else {
      //           setLoader(false);
      //           localStorage.removeItem("accessToken");
      //           router.push("/admin-login");
      //           return;
      //         }
      //       })
      //       .catch((error) => {
      //         setLoader(false);
      //         console.error("Error:", error);
      //         localStorage.removeItem("accessToken");
      //         router.push("/admin-login");
      //       });
      //   } catch {
      //     console.log("error");
      //     toast.error("server error!");
      //     localStorage.removeItem("accessToken");
      //     router.push("/admin-login");
      //   }
      // };
  return (
    <div>
      <div className=" flex  justify-between items-center  2xl:px-10  bg-white  2xl:h-[100px] xl:h-[70px] lg:h-[60px] md:h-[50px] sm:h-[45px] h-[45px]  xl:px-8 lg:px-5 md:px-4 sm:px-4 px-1 2xl:text-2xl xl:text-[18px] lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px]">
        <div>
          <h2 className="font-semibold ml-10 lg:ml-0"> Welcome To Admin Dashboard</h2>
        </div>

        <div className="flex gap-2">
          <div>
            <img src="/images/user-pic.jpg" className="w-10 xl:w-10 2xl:w-14" />
          </div>
          <div className="my-auto">
            <Menu as="div" className="relative inline-block text-left">
              <div className="">
                <Menu.Button className="inline-flex  w-full justify-center  text-sm font-semibold text-gray-900 shadow-sm   ring-gray-300 hover:bg-gray-50">
                  <h1 className="text-[10px] md:text-[10px] xl:text-[12px] 2xl:text-[16px] my-auto">
                    Admin
                  </h1>
                  <img
                    src="/images/down-arrow-5-.svg"
                    className="w-5 xl:w-6 2xl:w-8"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute border right-0 z-10 mt-5 w-40 2xl:w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      <a className=" bg-gray-100 text-gray-900 text-[10px] md:text-[10px] xl:text-[12px] 2xl:text-[16px] block px-4 py-2 text-sm">
                        Account settings
                      </a>
                    </Menu.Item>

                    <Menu.Item>
                      <button
                        onClick={signoutFunc}
                        type="submit"
                        className=" bg-gray-100 text-gray-900 block w-full px-4 py-2 text-left text-sm text-[10px] md:text-[10px] xl:text-[12px] 2xl:text-[16px]"
                      >
                        Sign out
                      </button>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
