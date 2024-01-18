import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./loader";
import { ToastContainer, toast } from "react-toastify";
import Topbar from "../app/admin/admin-dashboard/topbar";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const [getAllEvent, setGetAllEvent] = useState([]);
  const [isLoader, setLoader] = useState(false);
  const [getAllCate, setGetAllCate] = useState([]);
  const [allSubCategory, setAllCategory] = useState([]);
  const [current_page, setCurrentPage] = useState(1);
  const [total_pages, setTotalPages] = useState(1);
  const [isRefresh, setRefresh] = useState(false);
  const [limit, setLimit] =useState(5);
  const [getAllDashEvents,setGetAllDashEvents]=useState([]);
  const { adminAuthToken } = useAuth();

  // ---------get Dash Events--------------
  useEffect(() => {
    handleDashEvents(5, 1); 
  }, [ isRefresh]);
  
  const handleDashEvents = (limit, page) => {
    setLoader(true);
  
    const options = {
      method: "GET",
      url: "/api/event/getDashEvents",
      params: {
        limit: limit,
        page: page,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: adminAuthToken,
      },
    };
  
    axios
      .request(options)
      .then((response) => {
        setGetAllDashEvents(response?.data?.events);
        console.log("getdash",response?.data?.events);
        setLoader(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoader(false);
      });
  };
  
  
  
 


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
    defaultgetAllCate(5,1);
  }, [ isRefresh]);

  const defaultgetAllCate = (limit, page ) => {
    setLoader(true);
    const option = {
      method: "GET",
      url: `/api/category/getallCategory?limit=${limit}Today Work List.&page=${page}`,
    };
    axios
      .request(option)
      .then((response) => {
        setGetAllCate(response?.data?.categories);
        // setTotalPages(response?.data?.categories || 1);
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
              <div className=" flex my-auto gap-4 sm:gap-3 md:gap-4 lg:gap-3 xl:gap-3 2xl:gap-6 justify-between border w-[31.5%] sm:w-[31%] md:w-[23.5%] lg:w-[23.5%] xl:w-[23%] 2xl:w-[23.5%] bg-white sm:p-2 p-2 md:p-3 xl:p-4 2xl:p-6">
                <div className=" w-1/4 ">
                  <div className=" flex items-center bg-[#374151] w-[40px] h-[40px] sm:w-[40px] sm:h-[40px] md:w-[40px] md:h-[40px] xl:h-[45px] xl:w-[45px] 2xl:h-[70px] 2xl:w-[70px] rounded-[5px] xl:ml-1 2xl:ml-0">
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
                  <h2 className="  text-[10px] md:text-[11px] lg:text-[11px] xl:text-[13px] 2xl:text-[20px] text-gray-600    dashboard_box_t">
                    Total Providers{" "}
                  </h2>
                  <h3 className="font-semibold text-[18px] md:text-[16px] lg:text-[16px] xl:text-[20px] 2xl:text-[30px] lg:leading-5 xl:leading-7 2xl:leading-10">
                    3
                  </h3>
                </div>
              </div>

               <div className=" flex my-auto gap-4 sm:gap-3 md:gap-4 lg:gap-3 xl:gap-3 2xl:gap-6 justify-between border w-[31.5%] sm:w-[31%] md:w-[23.5%] lg:w-[23.5%] xl:w-[23%] 2xl:w-[23.5%] bg-white sm:p-2 p-2 md:p-3 xl:p-4 2xl:p-6">
                <div className=" w-1/4 ">
                  <div className=" flex items-center bg-[#374151] w-[40px] h-[40px] sm:w-[40px] sm:h-[40px] md:w-[40px] md:h-[40px] xl:h-[45px] xl:w-[45px] 2xl:h-[70px] 2xl:w-[70px] rounded-[5px] xl:ml-1 2xl:ml-0">
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

               <div className=" flex my-auto gap-4 sm:gap-3 md:gap-4 lg:gap-3 xl:gap-3 2xl:gap-6 justify-between border w-[31.5%] sm:w-[31%] md:w-[23.5%] lg:w-[23.5%] xl:w-[23%] 2xl:w-[23.5%] bg-white sm:p-2 p-2 md:p-3 xl:p-4 2xl:p-6">
                <div className=" w-1/4 ">
                  <div className=" flex items-center bg-[#374151] w-[40px] h-[40px] sm:w-[40px] sm:h-[40px] md:w-[40px] md:h-[40px] xl:h-[45px] xl:w-[45px] 2xl:h-[70px] 2xl:w-[70px] rounded-[5px] xl:ml-1 2xl:ml-0">
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
                  <h2 className="  text-[10px] md:text-[11px] lg:text-[11px] xl:text-[13px] 2xl:text-[20px] text-gray-600 dashboard_box_t">
                    Total Categories{" "}
                  </h2>
                  <h3 className="font-semibold text-[18px] md:text-[16px] lg:text-[16px] xl:text-[20px] 2xl:text-[30px] lg:leading-5 xl:leading-7 2xl:leading-10">
                    {getAllEvent?.totalCategories}
                  </h3>
                </div>
              </div>

               <div className=" flex my-auto gap-4 sm:gap-3 md:gap-4 lg:gap-3 xl:gap-3 2xl:gap-6 justify-between border w-[31.5%] sm:w-[31%] md:w-[23.5%] lg:w-[23.5%] xl:w-[23%] 2xl:w-[23.5%] bg-white sm:p-2 p-2 md:p-3 xl:p-4 2xl:p-6">
                <div className=" w-1/4 ">
                  <div className=" flex items-center bg-[#374151] w-[40px] h-[40px] sm:w-[40px] sm:h-[40px] md:w-[40px] md:h-[40px] xl:h-[45px] xl:w-[45px] 2xl:h-[70px] 2xl:w-[70px] rounded-[5px] xl:ml-1 2xl:ml-0">
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
                  <h2 className="  text-[10px] md:text-[8px] lg:text-[11px] xl:text-[13px] 2xl:text-[20px] text-gray-600 dashboard_box_t">
                    Total Subcategories{" "}
                  </h2>
                  <h3 className="font-semibold text-[18px] md:text-[16px] lg:text-[16px] xl:text-[20px] 2xl:text-[30px] lg:leading-5 xl:leading-7 2xl:leading-10">
                    {getAllEvent?.totalSubCategories}
                  </h3>
                </div>
              </div>
              {/* ---------------------//-------------- */}

               <div className=" flex my-auto gap-4 sm:gap-3 md:gap-4 lg:gap-3 xl:gap-3 2xl:gap-6 justify-between border w-[31.5%] sm:w-[31%] md:w-[23.5%] lg:w-[23.5%] xl:w-[23%] 2xl:w-[23.5%] bg-white sm:p-2 p-2 md:p-3 xl:p-4 2xl:p-6">
                <div className=" w-1/4 ">
                  <div className=" flex items-center bg-[#374151] w-[40px] h-[40px] sm:w-[40px] sm:h-[40px] md:w-[40px] md:h-[40px] xl:h-[45px] xl:w-[45px] 2xl:h-[70px] 2xl:w-[70px] rounded-[5px] xl:ml-1 2xl:ml-0">
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

               <div className=" flex my-auto gap-4 sm:gap-3 md:gap-4 lg:gap-3 xl:gap-3 2xl:gap-6 justify-between border w-[31.5%] sm:w-[31%] md:w-[23.5%] lg:w-[23.5%] xl:w-[23%] 2xl:w-[23.5%] bg-white sm:p-2 p-2 md:p-3 xl:p-4 2xl:p-6">
                <div className=" w-1/4 ">
                  <div className=" flex items-center bg-[#374151] w-[40px] h-[40px] sm:w-[40px] sm:h-[40px] md:w-[40px] md:h-[40px] xl:h-[45px] xl:w-[45px] 2xl:h-[70px] 2xl:w-[70px] rounded-[5px] xl:ml-1 2xl:ml-0">
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

               <div className=" flex my-auto gap-4 sm:gap-3 md:gap-4 lg:gap-3 xl:gap-3 2xl:gap-6 justify-between border w-[31.5%] sm:w-[31%] md:w-[23.5%] lg:w-[23.5%] xl:w-[23%] 2xl:w-[23.5%] bg-white sm:p-2 p-2 md:p-3 xl:p-4 2xl:p-6">
                <div className=" w-1/4 ">
                  <div className=" flex items-center bg-[#374151] w-[40px] h-[40px] sm:w-[40px] sm:h-[40px] md:w-[40px] md:h-[40px] xl:h-[45px] xl:w-[45px] 2xl:h-[70px] 2xl:w-[70px] rounded-[5px] xl:ml-1 2xl:ml-0">
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
        <div className="flex flex-col md:flex-row  justify-around my-10 xl:my-10 2xl:my-5  mx-7 gap-6 lg:gap-6">
          <div className="md:w-1/2 my-4 md:my-0">
            <div className="">
              <table className="min-w-full  bg-white border border-gray-300 text-[12px] sm:text-[12px] md:text-[12px] lg:text-[12px] xl:text-[13px] 2xl:text-[18px] ">
                <thead>
                  <tr className="border text-gray-500 text-start ">
                    <th className="w-1/6 border py-2 px-4 text-start ">S.no</th>
                    <th className="w-4/6 border py-2 px-4 text-start ">
                      Dash Events Name
                    </th>
                   
                  </tr>
                </thead>

                {getAllDashEvents?.length > 0 && (
                  <tbody>
                    {getAllDashEvents.map((item, index) => (
                      <tr key={index} className="text-gray-500">
                        <td className="w-1/6 border py-2 px-4 border-b text-start">
                          {index + 1 + "."}
                        </td>
                        <td className="w-4/6 border py-2 px-4 border-b text-start">
                          {item?.name}
                        </td>
                        
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </div>
          <div className="md:w-1/2 my-4 md:my-0">
            <div className="">
              <table className="min-w-full  bg-white border border-gray-300 text-[12px] sm:text-[12px] md:text-[12px] lg:text-[12px] xl:text-[13px] 2xl:text-[18px] ">
                <thead>
                  <tr className="border text-gray-500 text-start ">
                    <th className="w-1/6 border py-2 px-4 text-start ">S.no</th>
                    <th className="w-4/6 border py-2 px-4 text-start ">
                      Category Name
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
                        
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
   
    </>
  );
};

export default Dashboard;
