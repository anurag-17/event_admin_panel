import axios from "axios";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";
import GetAUser from "./getauser";
import Loader from "../../loader";
import Pagination from "../../pagination";
import { useAuth } from "../../../contexts/AuthContext";
import Topbar from "../../../app/admin/admin-dashboard/topbar";

const AllUser = () => {
  const [getAllUser, setGetAllUSer] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserID] = useState("");
  const [isRefresh, setRefresh] = useState(false);
  const { adminAuthToken } = useAuth();
  // const auth_token = JSON.parse(localStorage.getItem("accessToken" || ""));
  const [getaUser, setGetUser] = useState({});
  const [selectedItemData, setSelectedItemData] = useState("");
  const [isLoader, setLoader] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, SetCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [dialogMatch, setDialogMatch] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  // useEffect(() => {
  //   defaultGetaUser();
  // }, []);

  const defaultGetaUser = () => {
    setLoader(true);
    const option = {
      method: "POST",
      url: "/api/auth/getUserById",
      headers: {
        authorization: adminAuthToken,
      },
    };
    axios
      .request(option)
      .then((response) => {
        setGetUser(response?.data?.user);
        setLoader(false);
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  const handlePageChange = (newPage) => {
    SetCurrentPage(newPage);
  };

  const refreshData = () => {
    setRefresh(!isRefresh);
  };

  function closeModal() {
    setIsModalOpen(false);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function openModal(id) {
    const selectedItemData = getAllUser.filter((item) => item._id === id);
    setSelectedItemData(selectedItemData);
    setIsModalOpen(true);
  }
  useEffect(() => {
    defaultUsers(currentPage, limit);
  }, [currentPage, isRefresh]);

  const defaultUsers = (page, limit) => {
    setLoader(true);

    const option = {
      method: "GET",
      url: "/api/auth/all-users",
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
        setGetAllUSer(response.data.users);
        setLoader(false);
        setTotalPages(response?.data?.totalPages || 1);
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  const handleSearch = (e) => {
    const search = e.target.value;
    if (search.trim() === "") {
      refreshData();
    } else {
      const options = {
        method: "GET",
        url: `/api/auth/all-users?search=${search}`,
        headers: {
          authorization: adminAuthToken,
        },
      };
      axios
        .request(options)
        .then(function (response) {
          if (response.status === 200) {
            setGetAllUSer(response.data.users);
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };

  // ---------delete Api-----------
  const handleDelete = (userId) => {
    console.log(userId);
    // ;
    // alert("deleted successfully");
    // setDialogMatch(false);
    // return;

    const options = {
      method: "DELETE",
      url: `/api/auth/deleteaUser/${userId}`,

      headers: {
        "Content-Type": "application/json",
        authorization: adminAuthToken,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          // toast.success("Deleted successfully !");
          // handleClose();
          setDialogMatch(false);
          refreshData();
        } else {
          // toast.error("Failed. something went wrong!");
          return;
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  return (
    <>
      <Topbar />
      {isLoader && <Loader />}

      <div>
        <div className="mt-2 lg:mt-3 xl:mt-4 2xl:mt-7 flex justify-between items-center p-1 2xl:px-10 border ml-10 mr-4 lg:mx-8  bg-white rounded-lg   h-auto   xl:px-8 lg:px-5 md:px-4 sm:px-4 px-4 2xl:text-2xl xl:text-[18px] lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px]">
          <div className="  w-[50%] sm:w-[40%] my-3 ">
            <h2 className="font-semibold custom_heading_text">Users List </h2>
          </div>
          <div className="flex justify-end  w-[50%] sm:w-[40%] my-3 ">
            <input
              type="search"
              className=" border border-gray-500 py-[2px] lg:py-[4px] 2xl:py-3 rounded-lg w-full  max-w-[320px] 2xl:max-w-[440px]  md:w-12/12 focus:outline-none md:px-[15px] px-2 text-[15px] placeholder:text-[13px] custom_table_text"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="button-addon1"
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className=" flex mx-5 ml-10 mr-4 sm:mx-10 lg:mx-8  overflow-x-auto md:overscroll-none ">
          <div className=" w-full ">
            <table className="w-[155%] sm:w-[100%]  border bg-white rounded-md mt-5 p-10">
              <thead className="">
                <tr
                  className="bg-coolGray-200 text-gray-400 text-start flex  
                  custom_table_text"
                >
                  <th className="mx-3 lg:mx-3 w-1/12 text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5   ">
                    S.NO
                  </th>
                  <th className="  w-3/12 text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5  ">
                    USER NAME
                  </th>
                  <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-5/12 sm:w-4/12 ">
                    EMAIL
                  </th>
                  <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-2/12 ">
                    PROVIDER
                  </th>
                  <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-1/12 ">
                    VIEW
                  </th>
                  <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-1/12 ">
                    ACTION
                  </th>
                </tr>
              </thead>
              {getAllUser?.length > 0 && (
                <tbody>
                  {getAllUser.map((item, index) => {
                    const serialNumber = (currentPage - 1) * 10 + (index + 1);
                    return (
                      <tr
                        key={index}
                        className="text-start flex w-full custom_table_text"
                      >
                        <td className="my-auto mx-3 lg:mx-3 w-[7.5%] sm:w-1/12">
                          {serialNumber + "."}
                        </td>
                        <td className="my-auto w-[22.5%] sm:w-[24%] md:w-[24%] lg:w-[24.5%] ">
                          {item.firstname} {item.lastname}
                        </td>

                        <td className="my-auto w-[37.7%]  sm:w-[32.33%] 2xl:w-[33%]">
                          {item.email}
                        </td>
                        <td className="my-auto w-[15%]  sm:w-2/12">
                          {item.provider}
                        </td>
                        <td className="my-auto  w-1/12">
                          <button onClick={() => openModal(item?._id)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4 sm:w-5 sm:h-5 m:dw-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-9 2xl:h-9 text-sky-600 cursor-pointer"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                              />
                            </svg>
                          </button>
                        </td>
                        <td className="text-[12px] md:text-[14px] font-[400] py-3 ">
                          <button
                            onClick={() => {
                              setDialogMatch(true);
                              setDeleteId(item?._id);
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
                  })}
                </tbody>
              )}
              {Array.isArray(getAllUser) && getAllUser?.length === 0 && (
                <div className="py-6 px-4 border-t ">
                  <p className="text-[14px]  2xl:text-[20px] font-medium text-center">
                    {" "}
                    No Data Found{" "}
                  </p>
                </div>
              )}
            </table>
          </div>
        </div>
        {totalPages > 1 && (
          <Pagination
            total_pages={totalPages}
            current_page={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className=" z-10" onClose={closeModal}>
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
                <Dialog.Panel className="w-full max-w-[500px] transform overflow-hidden rounded-2xl bg-white pb-10 pt-5 px-12 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-end">
                    <button onClick={closeModal}>
                      <img
                        src="/images/close-square.svg"
                        className="w-7 md:w-7 lg:w-8 xl:w-9 2xl:w-14"
                        alt="close"
                      />
                    </button>
                  </div>
                  <Dialog.Title
                    as="h3"
                    className="lg:text-[20px] text-[16px] font-semibold leading-6 text-gray-900 mb-4"
                  >
                    <div></div>
                    User Detail
                  </Dialog.Title>
                  <GetAUser
                    selectedItemData={selectedItemData}
                    closeModal={closeModal}
                    refreshData={refreshData}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* --------user Delete----------- */}
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
                <Dialog.Panel className=" w-full max-w-[500px] transform overflow-hidden rounded-2xl bg-white py-10 px-12 text-left align-middle shadow-2xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="flex  custom_heading_text font-semibold leading-6 text-gray-900"
                  >
                    Are You Sure! Want to Delete?
                  </Dialog.Title>
                  <p className="lg:text-[16px] text-[16px] font-normal leading-[30px] text-gray-500 mt-4">
                    Do you really want to delete these records? You cant't view
                    this in your list anymore if you delete!
                  </p>
                  <div className="mt-8">
                    <div className="flex justify-between gap-x-5">
                      <button
                        className="w-full border border-1 rounded-md border-lightBlue-400 text-lightBlue-700 hover:bg-lightBlue-200 text-sm  px-2 py-3
                              hover:border-none  border-sky-400 text-sky-700 hover:bg-sky-200"
                        onClick={() => {
                          setDialogMatch(false);
                        }}
                      >
                        No, Keep It
                      </button>
                      {isLoader ? (
                        <button
                          className="w-full border border-1 rounded-md 
                              text-sm 
                              border-red-400 text-red-700 bg-red-200  px-2 py-3
                              hover:border-none"
                        >
                          Loading...
                        </button>
                      ) : (
                        <button
                          className="w-full border border-1 rounded-md 
                              text-sm 
                              border-red-400 text-red-700 hover:bg-red-200  px-2 py-3
                              hover:border-none"
                          onClick={() => handleDelete(deleteId)}
                        >
                          Yes, Delete It
                        </button>
                      )}
                    </div>
                  </div>

                  {/* <div className="mt-3 flex justify-center gap-14">
                    <button
                      className="px-5 py-1 rounded-lg border border-[green] text-[green]"
                      onClick={() => handleDelete(deleteId)}
                    >
                      Yes
                    </button>
                    <button
                      className="px-5 py-1 rounded-lg border border-[red] text-[red]"
                      onClick={() => {
                        setDialogMatch(false);
                      }}
                    >
                      No
                    </button>
                  </div> */}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AllUser;
