import React, { useEffect, useState } from "react";
import axios from "axios";
import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import DeleteModule from "./delete-modal";
import Loader from "../../loader";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "../../pagination";

const UserIssue = () => {
  const auth_token = JSON.parse(localStorage.getItem("accessToken" || ""));
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
  useEffect(() => {
    defaultGetIssue(current_page, limit);
  }, [current_page, !isRefresh]);

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
        authorization: auth_token,
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

  // -------------Resolved Events-----------
  // useEffect(()=>{
  //   handleAllResolved();
  // },[]);

  // const handleAllResolved = async () => {
  //   try {
  //     const option = {
  //       method: "GET",
  //       url: `/api/issue/getAllEventIssues?isResolved=${isResolve}`,
  //       headers: {
  //         authorization: auth_token,
  //       },
  //     };
  //     axios.request(option).then((response) => {
  //       console.log("All Resolved Issue", response?.data);
  //       // refreshData();
  //       setAllResolvedIssue(response?.data?.eventIssues || []);
  //       setTotalPages(response?.data?.total_pages || 1);
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // ----------All event Issue resolve----------
  const handleResolve = async (id, isResolve) => {
    try {
      const option = {
        method: "PUT",
        url: `/api/issue/updateEventIssue`,
        headers: {
          "Content-Type": "application/json",
          authorization: auth_token,
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

  const handleFilterChange = async(value) => {
    setLoader(true)
    if (value === "") {
      setSelectedFilter("all");
    } else {
      setSelectedFilter("resolved");
      try {
        const option = {
          method: "GET",
          url: `/api/issue/getAllEventIssues?isResolved=${value}`,
          headers: {
            authorization: auth_token,
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
    setLoader(false)
  };

  return (
    <>
      {isLoader && <Loader />}
      <div>
        <div className="mt-2 lg:mt-3 xl:mt-4 2xl:mt-7 flex justify-between items-center 2xl:pt-4 2xl:px-10 border ml-10 mr-4 lg:mx-8  bg-white rounded-lg   2xl:h-[100px] xl:h-[70px] lg:h-[60px] md:h-[50px] sm:h-[45px] h-[45px]  xl:px-8 lg:px-5 md:px-4 sm:px-4 px-1 2xl:text-2xl xl:text-[18px] lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px]">
          <h2 className="font-semibold">Users Issue List </h2>

          <div className="">
            <label className="text-[14px]">Issues:</label>
            <select
              className="text-[12px] rounded-sm border border-gray-300 ml-2"
              value={isResolve}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option className="text-[12px]" value="">
                All
              </option>
              <option className="text-[12px]" value="true">Resolved</option>
              <option className="text-[12px]" value="false">Not Resolved</option>
            </select>
          </div>

          <h2>Welcome Back, Admin</h2>
        </div>
        {Array.isArray(
          selectedFilter === "resolved" ? allResolvedIssue : getUserIssue
        ) && selectedFilter === "resolved"
          ? allResolvedIssue?.map((item) => (
              <div className="border bg-white sm:ml-10 sm:mr-4 lg:mx-8 rounded-md p-3 my-4 flex flex-col sm:flex-row mx-auto justify-around ">
                <div className="w-2/12">
                  <Link href={`/eventIssue/${item?._id}`} target="_blank">
                    <img
                      src={item?.event?.images[0]?.url}
                      alt="eventImage"
                      className="my-3 w-14 sm:w-16 md:w-20 lg:w-16 xl:w-20 2xl:w-28"
                    />
                  </Link>
                </div>
                <div className="w-5/12 ">
                  <h1 className="my-1 font-bold h1_text">
                    {item?.event?.name}
                  </h1>
                  <h1 className="my-1  h1_text">
                    Location : {item?.event?.location}
                  </h1>

                  <h1 className="my-1  h1_text">City : {item?.event?.city}</h1>
                  <h1 className="my-1  h1_text">Issue : {item?.issue}</h1>
                </div>
                <div className="w-4/12">
                  <h1 className="my-1  h1_text font-bold">Raised by :</h1>
                  <h1 className="my-1  h1_text">
                    Name : {item?.userId?.firstname} {item?.userId?.lastname}
                  </h1>
                  <h1 className="my-1  h1_text">
                    Email : {item?.userId?.email}{" "}
                  </h1>
                  <h1 className="my-1  h1_text">
                    Mobile : {item?.userId?.mobile}{" "}
                  </h1>
                </div>

                <div className="w-1/12 col-span-1 my-auto  h1_text">
                  <div className="mb-2">
                    {item?.isResolved ? (
                      <span className="border p-1 rounded-md my-1   border-green-400 text-green-700 ">
                        Resolved
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          handleResolve(item?._id, true);
                        }}
                        className="border p-1 rounded-md my-1 border-sky-400 text-sky-700 hover:bg-sky-200"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => openModal(item?._id)}
                      className="border p-1 rounded-md my-1  border-red-700 text-red-700 hover:bg-red-200 "
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          : getUserIssue?.map((item) => (
              <div className="border bg-white sm:ml-10 sm:mr-4 lg:mx-8 rounded-md p-3 my-4 flex flex-col sm:flex-row mx-auto justify-around ">
                <div className="w-2/12">
                  <Link href={`/eventIssue/${item?._id}`} target="_blank">
                    <img
                      src={item?.event?.images[0]?.url}
                      alt="eventImage"
                      className="my-3 w-14 sm:w-16 md:w-20 lg:w-16 xl:w-20 2xl:w-28"
                    />
                  </Link>
                </div>
                <div className="w-5/12 ">
                  <h1 className="my-1 font-bold h1_text">
                    {item?.event?.name}
                  </h1>
                  <h1 className="my-1  h1_text">
                    Location : {item?.event?.location}
                  </h1>

                  <h1 className="my-1  h1_text">City : {item?.event?.city}</h1>
                  <h1 className="my-1  h1_text">Issue : {item?.issue}</h1>
                </div>
                <div className="w-4/12">
                  <h1 className="my-1  h1_text font-bold">Raised by :</h1>
                  <h1 className="my-1  h1_text">
                    Name : {item?.userId?.firstname} {item?.userId?.lastname}
                  </h1>
                  <h1 className="my-1  h1_text">
                    Email : {item?.userId?.email}{" "}
                  </h1>
                  <h1 className="my-1  h1_text">
                    Mobile : {item?.userId?.mobile}{" "}
                  </h1>
                </div>

                <div className="w-1/12 col-span-1 my-auto  h1_text">
                  <div className="mb-2">
                    {item?.isResolved ? (
                      <span className="border p-1 rounded-md my-1   border-green-400 text-green-700 ">
                        Resolved
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          handleResolve(item?._id, true);
                        }}
                        className="border p-1 rounded-md my-1 border-sky-400 text-sky-700 hover:bg-sky-200"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => openModal(item?._id)}
                      className="border p-1 rounded-md my-1  border-red-700 text-red-700 hover:bg-red-200 "
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
      </div>
      { total_pages >1 && (
      <Pagination
        total_pages={total_pages}
        current_page={current_page}
        onPageChange={handlePageChange}
      />)}

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
                    className="lg:text-[20px] text-[16px] font-semibold leading-6 text-gray-900"
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
