import React, { useEffect, useState } from "react";
import axios from "axios";
import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import DeleteModule from "./delete-modal";
import Loader from "../../loader";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "../../pagination";
import { useAuth } from "../../../contexts/AuthContext";
import Topbar from "../../../app/admin/admin-dashboard/topbar";

const UserIssue = () => {
  const { adminAuthToken } = useAuth();
  // const auth_token = JSON.parse(localStorage.getItem("accessToken" || ""));
  const [getUserIssue, setGetUserIssue] = useState([]);
  const [isOpenDelete, setOpenDelete] = useState(false);
  const [isRefresh, setRefresh] = useState(false);
  const [issueID, setIssueId] = useState("");
  const [isLoader, setLoader] = useState(false);
  const [limit, setLimit] = useState(10);
  const [current_page, setCurrentPage] = useState(1);
  const [total_pages, setTotalPages] = useState(1);
  const [allResolvedIssue, setAllResolvedIssue] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isResolve, setIsResolve] = useState("");
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  function closeModal() {
    setOpenDelete(false);
  }

  function closeModal() {
    setOpenDelete(false);
  }
  const refreshData = () => {
    setRefresh(!isRefresh);
  };
  function openModal(id) {
    setIssueId(id);
    setOpenDelete(true);
  }

  // --------get All Event Issue----------
  // useEffect(() => {
  //   defaultGetIssue(current_page, limit);
  // }, [current_page, !isRefresh]);

  const defaultGetIssue = (page, limit) => {
    setLoader(true);
    const option = {
      method: "GET",
      url: "/api/issue/getAllEventIssues",
      params: {
        page: page,
        limit: limit,
      },
      headers: {
        authorization: adminAuthToken,
      },
    };
    axios
      .request(option)
      .then((response) => {
        // refreshData();
        setGetUserIssue(response?.data?.eventIssues);
        setLoader(false);
        setTotalPages(response?.data?.total_pages || 1);
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  // ----------All event Issue resolve----------
  const handleResolve = async (id, isResolve) => {
    try {
      const option = {
        method: "PUT",
        url: `/api/issue/updateEventIssue`,
        headers: {
          "Content-Type": "application/json",
          authorization: adminAuthToken,
        },
        data: {
          _id: id,
          isResolved: isResolve,
        },
      };
      const response = await axios(option);
      if (response.status == 200) {
        console.log(response);
        refreshData();
      } else {
        throw new Error("Failed to resolve");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedFilter === "all") {
      defaultGetIssue(current_page, limit);
    } else if (selectedFilter === "resolved") {
      // handleAllResolved();
    }
  }, [current_page, limit, isRefresh, selectedFilter]);

  const handleFilterChange = async (value) => {
    setLoader(true);
    if (value === "") {
      setSelectedFilter("all");
    } else {
      setSelectedFilter("resolved");
      try {
        const option = {
          method: "GET",
          url: `/api/issue/getAllEventIssues?isResolved=${value}`,
          headers: {
            authorization: adminAuthToken,
          },
        };
        await axios.request(option).then((response) => {
          console.log("All Resolved Issue", response?.data);
          // refreshData();
          setAllResolvedIssue(response?.data?.eventIssues || []);
          setTotalPages(response?.data?.total_pages || 1);
        });
      } catch (error) {
        console.error(error);
      }
    }
    setIsResolve(value);
    setLoader(false);
  };

  return (
    <>
      {isLoader && <Loader />}
      <Topbar />
      <div>
        <div className="mt-2 lg:mt-3 xl:mt-4 2xl:mt-7 flex justify-between items-center 2xl:p-4 2xl:px-10 border sm:ml-10 mx-4 sm:mr-4 lg:mx-8  bg-white rounded-lg   h-auto  xl:p-2 p-2 2xl:text-2xl xl:text-[18px] lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px]">
          <h2 className="font-semibold custom_heading_text">
            Users Issue List{" "}
          </h2>

          <div className="">
            <div>
              <label className=" text-gray-500 text-[9px] sm:text-[10px] md:text-[10px] lg:text-[12px] xl:text-[14px] 2xl:text-[18px]">
                Issues:
              </label>
            </div>
            <select
              className="cursor-pointer rounded border border-gray-300 bg-gray-50 text-gray-500 focus:bg-white dark:border dark:border-gray-600 focus:outline-none relative 
                  2xl:text-sm  2xl:px-3 2xl:py-0 2xl:h-[37px] 2xl:w-44 
                      xl:px-3 xl:py-0  xl:w-32
                      lg:px-2 lg:py-1  lg:w-32
                   md:px-3 md:py-0 md:h-[25px] 
                   sm:px-2 sm:py-0 
                        px-2 pb-0 h-[24px] custom_dropdown_text "
              value={isResolve}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option className="custom_dropdown_text" value="">
                All
              </option>
              <option className="custom_dropdown_text" value="true">
                Resolved
              </option>
              <option className="custom_dropdown_text" value="false">
                Not Resolved
              </option>
            </select>
          </div>
        </div>
        {Array.isArray(
          selectedFilter === "resolved" ? allResolvedIssue : getUserIssue
        ) && selectedFilter === "resolved"
          ? allResolvedIssue?.map((item) => (
              <div className="border  bg-white sm:ml-10 sm:mr-4 lg:mx-8 rounded-md p-3 my-4 flex flex-col sm:flex-row mx-auto justify-around ">
                <div className="w-2/12">
                  <Link href={`/eventIssue/${item?._id}`} target="_blank">
                    <img
                      src={item?.event?.images[0]?.url}
                      alt="eventImage"
                      className="my-3 w-14 sm:w-16 md:w-20 lg:w-16 xl:w-20 2xl:w-28"
                    />
                  </Link>
                </div>
                <div className="w-4/12 ">
                  <h1 className="my-1 font-bold custom_table_text">
                    {item?.event?.name}
                  </h1>
                  <h1 className="my-1  custom_table_text">
                    Location : {item?.event?.location}
                  </h1>

                  <h1 className="my-1  custom_table_text">
                    City : {item?.event?.city}
                  </h1>
                  <h1 className="my-1  custom_table_text">
                    Issue : {item?.issue}
                  </h1>
                </div>
                <div className="w-4/12">
                  <h1 className="my-1  custom_table_text font-bold">
                    Raised by :
                  </h1>
                  <h1 className="my-1  custom_table_text">
                    Name : {item?.userId?.firstname} {item?.userId?.lastname}
                  </h1>
                  <h1 className="my-1  custom_table_text">
                    Email : {item?.userId?.email}{" "}
                  </h1>
                  <h1 className="my-1  custom_table_text">
                    Mobile : {item?.userId?.mobile}{" "}
                  </h1>
                </div>

                <div className="w-2/12  col-span-1 my-auto  custom_table_text">
                  <div className="mb-2">
                    {item?.isResolved ? (
                      <div className="flex sm:justify-end w-full">
                        <button className="w-4/6  border p-1  rounded-md  border-green-400 text-green-700 hover:bg-green-200">
                          Resolved
                        </button>
                      </div>
                    ) : (
                      <div>
                        <button
                          onClick={() => {
                            handleResolve(item?._id, true);
                          }}
                          className={`w-full border p-1 rounded-md my-1 ${
                            item?.isResolved
                              ? "border-green-400 text-green-700"
                              : "border-sky-400 text-sky-700 hover:bg-sky-200"
                          }`}
                        >
                          Resolve
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex sm:justify-end">
                    <button
                      onClick={() => openModal(item?._id)}
                      className="w-4/6 border p-1 rounded-md my-1  border-red-700 text-red-700 hover:bg-red-200 "
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          : getUserIssue?.map((item) => (
              <div className="border bg-white sm:ml-10  mx-4 sm:mr-4 lg:mx-8 rounded-md p-3 my-4 flex flex-col sm:flex-row  justify-around ">
                <div className="w-2/12">
                  <Link href={`/eventIssue/${item?._id}`} target="_blank">
                    <img
                      src={item?.event?.images[0]?.url}
                      alt="eventImage"
                      className="my-3 w-14 sm:w-16 md:w-20 lg:w-16 xl:w-20 2xl:w-28"
                    />
                  </Link>
                </div>
                <div className="w-4/12 ">
                  <h1 className="my-1 font-bold custom_table_text">
                    {item?.event?.name}
                  </h1>
                  <h1 className="my-1  custom_table_text">
                    Location : {item?.event?.location}
                  </h1>

                  <h1 className="my-1  custom_table_text">
                    City : {item?.event?.city}
                  </h1>
                  <h1 className="my-1  custom_table_text">
                    Issue : {item?.issue}
                  </h1>
                </div>
                <div className="w-4/12">
                  <h1 className="my-1  custom_table_text font-bold">
                    Raised by :
                  </h1>
                  <h1 className="my-1  custom_table_text">
                    Name : {item?.userId?.firstname} {item?.userId?.lastname}
                  </h1>
                  <h1 className="my-1  custom_table_text">
                    Email : {item?.userId?.email}{" "}
                  </h1>
                  <h1 className="my-1  custom_table_text">
                    Mobile : {item?.userId?.mobile}{" "}
                  </h1>
                </div>

                <div className="flex items-center w-1/3 md:w-2/12 lg:w-2/12 xl:w-1/12 col-span-1 custom_table_text">
                  <div className=" flex flex-col gap-2 2xl:gap-2 w-full ">
                    <div className="">
                      {item?.isResolved ? (
                        <div className="flex sm:justify-end w-full">
                          <button className="w-4/6 lg:w-full border p-1  rounded-md  border-green-400 text-green-700 hover:bg-green-200">
                            Resolved
                          </button>
                        </div>
                      ) : (
                        <div className="flex sm:justify-end">
                          <button className="w-4/6 lg:w-full border p-1  rounded-md  border-sky-400 text-sky-700 hover:bg-sky-200">
                            Resolve
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex sm:justify-end">
                      <button
                        onClick={() => openModal(item?._id)}
                        className=" w-4/6 lg:w-full border p-1  rounded-md   border-red-700 text-red-700 hover:bg-red-200 "
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>
      {total_pages > 1 && (
        <Pagination
          total_pages={total_pages}
          current_page={current_page}
          onPageChange={handlePageChange}
        />
      )}

      <Transition appear show={isOpenDelete} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                <Dialog.Panel className="w-full max-w-[500px] transform overflow-hidden rounded-2xl bg-white py-10 px-12 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="custom_heading_text font-semibold leading-6 text-gray-900"
                  >
                    Are You Sure! Want to Delete?
                  </Dialog.Title>
                  <DeleteModule
                    issueID={issueID}
                    closeModal={closeModal}
                    refreshData={refreshData}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default UserIssue;
