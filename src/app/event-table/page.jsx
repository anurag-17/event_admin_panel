"use client";
import axios from "axios";
import React, { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Pagination from "../../component/pagination";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import protectedRoute from "../../component/utils/withAuth";
import Loader from "../../component/loader";
import Topbar from "../admin/admin-dashboard/topbar";

const EventRedirection = () => {
  const [getAllEvent, setGetAllEvent] = useState([]);
  const [current_page, setCurrentPage] = useState(1);
  const [isRefresh, setRefresh] = useState(false);
  const [limit, setLimit] = useState(10);
  const [total_pages, setTotalPages] = useState(1);
  const [isLoader, setLoader] = useState(false);
  const { adminAuthToken } = useAuth();
  const [dialogMatch, setDialogMatch] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const convertTime = (time) => {
    const parsedDateTime = moment.utc(time);
    const formattedDateTime = parsedDateTime.format("DD/MM/YYYY HH:mm");
    return formattedDateTime;
  };

  const refreshData = () => setRefresh(!isRefresh);

  const handlePageChange = (newPage) => setCurrentPage(newPage);

  const fetchData = async (searchTerm = "", page, limit) => {
    setLoader(true);
    try {
      const res = await axios.get(
        `/api/redirection/getAllEventRedirections?searchQuery=${searchTerm}&limit=${limit}&page=${current_page}`,
        {
          headers: {
            "content-type": "application/json",
            authorization: adminAuthToken,
          },
        }
      );
      if (res.status === 200) {
        const { eventRedirections, total_pages } = res?.data;
        setGetAllEvent(eventRedirections);
        setTotalPages(total_pages || 1);
      } else {
        console.error("Unexpected response status:", res.status);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoader(false);
    }
  };

  const defaultEvent = async (page, limit) => {
    fetchData("", page, limit);
  };

  const searchDataFunc = async (searchTerm) => {
    if (searchTerm.trim() === "") {
      defaultEvent(current_page, limit);
    } else {
      fetchData(searchTerm);
    }
  };

  const handleSearchChange = (event) => {
    searchDataFunc(event.target.value);
  };

  const handleDelete = async (eventID) => {
    try {
      const response = await axios.delete(
        "/api/redirection/deleteEventRedirection",
        {
          data: { _id: eventID },
          headers: {
            "Content-Type": "application/json",
            authorization: adminAuthToken,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Deleted successfully !");
        setDialogMatch(false);
        refreshData();
      } else {
        // toast.error("Failed. something went wrong!");
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    defaultEvent(current_page, limit);
  }, [current_page, isRefresh]);

  return (
    <>
      {isLoader && <Loader />}
      <ToastContainer autoClose={1000} />
      <Topbar />
      <div className="bg-[#F3F3F3] pt-4">
        <div className="pt-1 flex sm:flex-row flex-col justify-items-center sm:justify-between  items-center  2xl:pt- 2xl:px-10 border mx-4 lg:mx-8 bg-white rounded-lg 2xl:h-[100px] xl:h-[70px] lg:h-[60px] md:h-[50px] sm:h-[45px] h-[70px] xl:px-8 lg:px-5 md:px-4 sm:px-4 px-1 2xl:text-2xl xl:text-[18px] lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px]">
          <h2 className="font-semibold custom_heading_text">
            Redirected Event List{" "}
          </h2>

          {/* <div className="flex items-center justify-center w-[165px] sm:w-[27%]">
            <input
              type="search"
              className="border border-gray-500 py-[2px] lg:py-[4px] 2xl:py-[4px] rounded-lg w-full lg:max-w-auto  mx-auto md:w-11/12 focus:outline-none md:px-[15px] px-2 text-[15px] placeholder:text-[13px]"
              placeholder="Search"
              onChange={handleSearchChange}
            />
          </div> */}
        </div>

        <div className="overflow-x-scroll  mx-4 lg:mx-8">
          <div className="    ">
            <table className="mx-auto w-full table-auto mt-[20px] ">
              <thead>
                <tr className="border custom_table_text">
                  <th className="py-3 pl-5 px-2 text-left bg-[white]">
                    <p className="block  font-medium  text-[#72727b]">S.No</p>
                  </th>
                  <th className="py-3 pl-5 px-2 text-left bg-[white]">
                    <p className="block  font-medium  text-[#72727b]">
                      Event Name
                    </p>
                  </th>
                  <th className="py-3 px-5 text-left bg-[white] ">
                    <p className="block  font-medium  text-[#72727b]">
                      Category
                    </p>
                  </th>
                  <th className="py-3 px-5 text-left bg-[white]">
                    <p className="block  font-medium  text-[#72727b]">Date</p>
                  </th>

                  <th className="py-3 px-5 text-left bg-[white]">
                    <p className="block  font-medium  text-[#72727b]">Venue</p>
                  </th>

                  <th className="py-3 px-5 text-left bg-[white]">
                    <p className="block  font-medium  text-[#72727b]">
                      Response
                    </p>
                  </th>

                  <th className="py-3 px- text-left bg-[white]">
                    <p className="block  font-medium  text-[#72727b]">Delete</p>
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {Array.isArray(getAllEvent) && getAllEvent?.length > 0 ? (
                  getAllEvent?.map((items, index) => {
                    const serialNumber = (current_page - 1) * 10 + (index + 1);

                    return (
                      <tr key={items?._id} className="custom_table_text">
                        <td className=" font-[400] py-3 px-5 capitalize">
                          {serialNumber + "."}
                        </td>
                        <td className=" font-[400]  sm:w-[307px] py-3 px-5  capitalize">
                          <p className=" w-[200px] md:w-full">
                            {items?.event?.name}
                          </p>
                        </td>
                        <td className=" font-[400] py-3 px-5 capitalize">
                          {items?.event?.category?.title}
                        </td>
                        <td className=" font-[400] py-3 px-5 ">
                          {items?.event?.startDate
                            ? convertTime(items?.event?.startDate)
                            : ""}
                        </td>
                        <td className=" font-[400] py-3 px-5 capitalize">
                          {items?.event?.city}
                        </td>
                        <td className="py-3 font-[400] pt-3  pl-12  px-5 ">
                          <div> {items?.redirection}</div>
                        </td>
                        <td className=" font-[400] py-3 ">
                          <button
                            onClick={() => {
                              setDialogMatch(true);
                              setDeleteId(items?._id);
                            }}
                            type="button"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8 text-red-800"
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
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7">
                      <div className="w-full flex justify-center">
                        <p className="text-[12px] sm:text-[16px] ">
                          No data found
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {total_pages > 1 && (
          <Pagination
            total_pages={total_pages}
            current_page={current_page}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      {/* ------------delete popup--------- */}
      <Transition appear show={dialogMatch} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-5/6 sm:w-full sm:max-w-[500px] transform overflow-hidden rounded-2xl bg-white p-7  sm:px-8 lg:px-8 2xl:p-10  text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="flex justify-center lg:text-[20px] text-[16px] font-semibold leading-6 text-gray-900"
                  >
                    Are You Sure! Want to Delete?
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-[16px] font-normal  text-gray-500 mt-4">
                      Do you really want to delete these records? You can't view
                      this in your list anymore if you delete!
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-8">
                    <div className="flex justify-between gap-x-5">
                      <button
                        className="w-full border border-1 rounded-md border-lightBlue-400 text-lightBlue-700 hover:bg-lightBlue-200 text-sm  px-2 py-3
                              hover:border-none  border-sky-400 text-sky-700 hover:bg-sky-200 custom_btn_d "
                        onClick={() => {
                          setDialogMatch(false);
                        }}
                      >
                        No, Keep It
                      </button>

                      <button
                        className={`w-full  rounded-md 
            custom_btn_d 
                              border-red-400 text-red-700 bg-red-200  
                              hover:border-none
                        ${isLoader ? "bg-gray-200" : "hover:bg-red-200"}
                        hover:border-none`}
                        onClick={() => handleDelete(deleteId)}
                        disabled={isLoader}
                      >
                        {isLoader ? "Deleting..." : "Yes, Delete It"}
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default protectedRoute(EventRedirection);
