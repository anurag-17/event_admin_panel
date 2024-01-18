import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Loader from "./loader";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ToastContainer, toast } from "react-toastify";
import Topbar from "../app/admin/admin-dashboard/topbar";

const Dashboard = () => {
  const [getAllEvent, setGetAllEvent] = useState([]);
  const [isLoader, setLoader] = useState(false);
  const [getAllCate, setGetAllCate] = useState([]);
  const [allSubCategory, setAllCategory] = useState([]);
  const [current_page, setCurrentPage] = useState(1);
  const [total_pages, setTotalPages] = useState(1);
  const [isRefresh, setRefresh] = useState(false);
  const [limit, setLimit] =useState(5);


  useEffect(() => {
    defaultEvent();
  }, []);

  const defaultEvent = () => {
    setLoader(true);

    const option = {
      method: "GET",
      url: "/api/event/getStats",
    };
    axios
      .request(option)
      .then((response) => {
        setGetAllEvent(response?.data);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err, "Error");
      });
  };

  useEffect(() => {
    defaultgetAllCate(current_page , limit);
  }, [current_page, isRefresh]);

  const defaultgetAllCate = (limit, page ) => {
    setLoader(true);
    const option = {
      method: "GET",
      url: `/api/category/getallCategory?limit=${limit}&page=${page}`,
    };
    axios
      .request(option)
      .then((response) => {
        setGetAllCate(response?.data?.categories);
        setTotalPages(response?.data?.categories || 1);
      })
      .catch((err) => {
        console.log(err, "Error");
      });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  
  useEffect(() => {
    defaultsubCategory(current_page , limit);
  }, [current_page, isRefresh]);

  const defaultsubCategory = (limit, page ) => {
    const options = {
      method: "GET",
      url: `/api/subCategory/getallSubCategory?limit=${limit}&page=${page}`,
      headers: {
        "content-type": "application/json",
        // authorization: auth_token,
      },
    };

    axios
      .request(options)
      .then((response) => {
        setAllCategory(response?.data?.subCategories);
        setTotalPages(response?.data?.subCategories || 1);

      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

 
  return (
    <>
      {isLoader && <Loader />}
      <ToastContainer autoClose={1000} />

      <div>
        {/* ---------first--------- */}
        <Topbar />

        {/* ---------second-------- */}
        {getAllEvent && (
          <div className="flex w-12/12">
            <div className="flex flex-wrap  gap-3 xl:gap-6 mt-8 mx-7">
              <div className=" flex my-auto md:gap-4 lg:gap-3 xl:gap-3 2xl:gap-6 justify-between border sm:w-[23.5%] md:w-[23.5%] lg:w-[23.5%] xl:w-[23%] 2xl:w-[23.5%] bg-white sm:p-2 md:p-3 xl:p-4 2xl:p-6">
                <div className=" w-1/4 ">
                  <div className=" flex items-center bg-[#374151] sm:w-[40px] sm:h-[40px] md:w-[40px] md:h-[40px] xl:h-[45px] xl:w-[45px] 2xl:h-[70px] 2xl:w-[70px] rounded-[5px] xl:ml-1 2xl:ml-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="mx-auto w-4 h-4  xl:mt-0 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-[17px] lg:h-[17px] xl:w-6 xl:h-6 2xl:w-9 2xl:h-9 text-white "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                      />
                    </svg>
                  </div>
                </div>
                <div className=" w-3/4 ">
                  <h2 className="  text-[10px] md:text-[11px] lg:text-[11px] xl:text-[13px] 2xl:text-[20px] text-gray-600">
                    Total Providers{" "}
                  </h2>
                  <h3 className="font-semibold text-[18px] md:text-[16px] lg:text-[16px] xl:text-[20px] 2xl:text-[30px] lg:leading-5 xl:leading-7 2xl:leading-10">
                    3
                  </h3>
                </div>
              </div>

              <div className=" flex my-auto md:gap-4 lg:gap-3 xl:gap-3 2xl:gap-6 justify-between border sm:w-[23.5%] md:w-[23.5%] lg:w-[23.5%] xl:w-[23%] 2xl:w-[23.5%] bg-white sm:p-2 md:p-3 xl:p-4 2xl:p-6">
                <div className=" w-1/4 ">
                  <div className=" flex items-center bg-[#374151] sm:w-[40px] sm:h-[40px] md:w-[40px] md:h-[40px] xl:h-[45px] xl:w-[45px] 2xl:h-[70px] 2xl:w-[70px] rounded-[5px] xl:ml-1 2xl:ml-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="mx-auto  w-4 h-4  xl:mt-0 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-9 2xl:h-9 text-white "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                      />
                    </svg>
                  </div>
                </div>
                <div className=" w-3/4 ">
                  <h2 className="  text-[10px] md:text-[11px] lg:text-[11px] xl:text-[13px] 2xl:text-[20px] text-gray-600">
                    Total Events{" "}
                  </h2>
                  <h3 className="font-semibold text-[18px] md:text-[16px] lg:text-[16px] xl:text-[20px] 2xl:text-[30px] lg:leading-5 xl:leading-7 2xl:leading-10">
                    {getAllEvent?.totalEvents}
                  </h3>
                </div>
              </div>

              <div className=" flex my-auto md:gap-4 lg:gap-3 xl:gap-3 2xl:gap-6 justify-between border sm:w-[23.5%] md:w-[23.5%] lg:w-[23.5%] xl:w-[23%] 2xl:w-[23.5%] bg-white sm:p-2 md:p-3 xl:p-4 2xl:p-6">
                <div className=" w-1/4 ">
                  <div className=" flex items-center bg-[#374151] sm:w-[40px] sm:h-[40px] md:w-[40px] md:h-[40px] xl:h-[45px] xl:w-[45px] 2xl:h-[70px] 2xl:w-[70px] rounded-[5px] xl:ml-1 2xl:ml-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="mx-auto  w-4 h-4  xl:mt-0 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-9 2xl:h-9 text-white "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                      />
                    </svg>
                  </div>
                </div>
                <div className=" w-3/4 ">
                  <h2 className="  text-[10px] md:text-[11px] lg:text-[11px] xl:text-[13px] 2xl:text-[20px] text-gray-600">
                    Total Categories{" "}
                  </h2>
                  <h3 className="font-semibold text-[18px] md:text-[16px] lg:text-[16px] xl:text-[20px] 2xl:text-[30px] lg:leading-5 xl:leading-7 2xl:leading-10">
                    {getAllEvent?.totalCategories}
                  </h3>
                </div>
              </div>

              <div className=" flex my-auto md:gap-4 lg:gap-3 xl:gap-3 2xl:gap-6 justify-between border sm:w-[23.5%] md:w-[23.5%] lg:w-[23.5%] xl:w-[23%] 2xl:w-[23.5%] bg-white sm:p-2 md:p-3 xl:p-4 2xl:p-6">
                <div className=" w-1/4 ">
                  <div className=" flex items-center bg-[#374151] sm:w-[40px] sm:h-[40px] md:w-[40px] md:h-[40px] xl:h-[45px] xl:w-[45px] 2xl:h-[70px] 2xl:w-[70px] rounded-[5px] xl:ml-1 2xl:ml-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="mx-auto  w-4 h-4  xl:mt-0 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-9 2xl:h-9 text-white "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
                      />
                    </svg>
                  </div>
                </div>
                <div className=" w-3/4 ">
                  <h2 className="  text-[10px] md:text-[8px] lg:text-[11px] xl:text-[13px] 2xl:text-[20px] text-gray-600">
                    Total Subcategories{" "}
                  </h2>
                  <h3 className="font-semibold text-[18px] md:text-[16px] lg:text-[16px] xl:text-[20px] 2xl:text-[30px] lg:leading-5 xl:leading-7 2xl:leading-10">
                    {getAllEvent?.totalSubCategories}
                  </h3>
                </div>
              </div>
              {/* ---------------------//-------------- */}

              <div className=" flex my-auto md:gap-4 lg:gap-3 xl:gap-3 2xl:gap-6 justify-between border sm:w-[23.5%] md:w-[23.5%] lg:w-[23.5%] xl:w-[23%] 2xl:w-[23.5%] bg-white sm:p-2 md:p-3 xl:p-4 2xl:p-6">
                <div className=" w-1/4 ">
                  <div className=" flex items-center bg-[#374151] sm:w-[40px] sm:h-[40px] md:w-[40px] md:h-[40px] xl:h-[45px] xl:w-[45px] 2xl:h-[70px] 2xl:w-[70px] rounded-[5px] xl:ml-1 2xl:ml-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="mx-auto w-4 h-4  xl:mt-0 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-[17px] lg:h-[17px] xl:w-6 xl:h-6 2xl:w-9 2xl:h-9 text-white "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                      />
                    </svg>
                  </div>
                </div>
                <div className=" w-3/4 ">
                  <h2 className="  text-[10px] md:text-[11px] lg:text-[11px] xl:text-[13px] 2xl:text-[20px] text-gray-600">
                    Total Event Issues{" "}
                  </h2>
                  <h3 className="font-semibold text-[18px] md:text-[16px] lg:text-[16px] xl:text-[20px] 2xl:text-[30px] lg:leading-5 xl:leading-7 2xl:leading-10">
                    {getAllEvent?.totalEventIssues}
                  </h3>
                </div>
              </div>

              <div className=" flex my-auto md:gap-4 lg:gap-3 xl:gap-3 2xl:gap-6 justify-between border sm:w-[23.5%] md:w-[23.5%] lg:w-[23.5%] xl:w-[23%] 2xl:w-[23.5%] bg-white sm:p-2 md:p-3 xl:p-4 2xl:p-6">
                <div className=" w-1/4 ">
                  <div className=" flex items-center bg-[#374151] sm:w-[40px] sm:h-[40px] md:w-[40px] md:h-[40px] xl:h-[45px] xl:w-[45px] 2xl:h-[70px] 2xl:w-[70px] rounded-[5px] xl:ml-1 2xl:ml-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="mx-auto  w-4 h-4  xl:mt-0 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-9 2xl:h-9 text-white "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                      />
                    </svg>
                  </div>
                </div>
                <div className=" w-3/4 ">
                  <h2 className="  text-[10px] md:text-[11px] lg:text-[11px] xl:text-[13px] 2xl:text-[20px] text-gray-600">
                    Event Redirections
                  </h2>
                  <h3 className="font-semibold text-[18px] md:text-[16px] lg:text-[16px] xl:text-[20px] 2xl:text-[30px] lg:leading-5 xl:leading-7 2xl:leading-10">
                    {getAllEvent?.totalEventRedirections}
                  </h3>
                </div>
              </div>

              <div className=" flex my-auto md:gap-4 lg:gap-3 xl:gap-3 2xl:gap-6 justify-between border sm:w-[23.5%] md:w-[23.5%] lg:w-[23.5%] xl:w-[23%] 2xl:w-[23.5%] bg-white sm:p-2 md:p-3 xl:p-4 2xl:p-6">
                <div className=" w-1/4 ">
                  <div className=" flex items-center bg-[#374151] sm:w-[40px] sm:h-[40px] md:w-[40px] md:h-[40px] xl:h-[45px] xl:w-[45px] 2xl:h-[70px] 2xl:w-[70px] rounded-[5px] xl:ml-1 2xl:ml-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="mx-auto w-4 h-4  xl:mt-0 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-[17px] lg:h-[17px] xl:w-6 xl:h-6 2xl:w-9 2xl:h-9 text-white "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                      />
                    </svg>
                  </div>
                </div>
                <div className=" w-3/4 ">
                  <h2 className="  text-[10px] md:text-[11px] lg:text-[11px] xl:text-[13px] 2xl:text-[20px] text-gray-600">
                    Total Users{" "}
                  </h2>
                  <h3 className="font-semibold text-[18px] md:text-[16px] lg:text-[16px] xl:text-[20px] 2xl:text-[30px] lg:leading-5 xl:leading-7 2xl:leading-10">
                    {getAllEvent?.totalUsers}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-around my-10 xl:my-10 2xl:my-5 ">
          <div className="w-1/2 xl:ml-7 xl:mr-8 lg:mx-6">
            <div className="">
              <table className="min-w-full  bg-white border border-gray-300 sm:text-[12px] md:text-[12px] lg:text-[12px] xl:text-[13px] 2xl:text-[18px] ">
                <thead>
                  <tr className="border text-gray-500 text-start ">
                    <th className="w-1/6 border py-2 px-4 text-start ">S.no</th>
                    <th className="w-4/6 border py-2 px-4 text-start ">
                      Category Name
                    </th>
                    <th className="w-1/6 border py-2 px-4 text-start">
                      Action
                    </th>
                  </tr>
                </thead>

                {getAllCate?.length > 0 && (
                  <tbody>
                    {getAllCate.map((item, index) => (
                      <tr key={index} className="text-gray-500">
                        <td className="w-1/6 border py-2 px-4 border-b text-start">
                          {index + 1 + "."}
                        </td>
                        <td className="w-4/6 border py-2 px-4 border-b text-start">
                          {item.title}
                        </td>
                        <td className="border w-1/6  py-2 xl:px-4 lg:px-2">
                          <button>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-[18px] xl:h-[18px] 2xl:w-7 2xl:h-7 text-sky-600 lg:mx-1 2xl:mx-2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                              />
                            </svg>
                          </button>
                          <button type="button">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-[18px] xl:h-[18px] 2xl:w-7 2xl:h-7  text-red-800"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </div>
          <div className="w-1/2 md:ml-6 xl:ml-7 xl:mr-8 lg:mx-3 ">
            <div className="container mx-auto">
              <table className="min-w-full bg-white border border-gray-300 sm:text-[12px] md:text-[12px] lg:text-[12px] xl:text-[13px] 2xl:text-[18px]">
                <thead>
                  <tr className="border text-gray-500 text-[]">
                    <th className="w-1/6 border py-2 px-4 text-start">S.no</th>
                    <th className="w-2/6 border py-2 px-4 text-start">
                      Sub Category Name
                    </th>
                    <th className="w-2/6 border py-2 px-4 text-start">
                      Category Name
                    </th>
                    <th className="w-1/6 border py-2 xl:px-4 lg:px-2 text-start">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allSubCategory?.length > 0 &&
                    allSubCategory?.map((item, index) => (
                      <tr key={index} className="text-gray-500">
                        <td className="w-1/6 border py-2 px-4 border-b">
                          {" "}
                          {index + 1 + "."}
                        </td>

                        <td className="w-2/6 border py-2 px-4 border-b">
                          {item?.subCategory ? item?.subCategory : "-"}
                        </td>
                        <td className="w-2/6 border py-2 px-4 border-b">
                          {item?.category?.title}
                        </td>
                        <td className="border w-1/6  py-2 xl:px-4 lg:px-2">
                          <button>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-[18px] xl:h-[18px] 2xl:w-7 2xl:h-7 text-sky-600 lg:mx-1 2xl:mx-2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                              />
                            </svg>
                          </button>
                          <button type="button">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-[18px] xl:h-[18px] 2xl:w-7 2xl:h-7  text-red-800"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
   
    </>
  );
};

export default Dashboard;
