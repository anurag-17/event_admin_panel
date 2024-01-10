import axios from "axios";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";
import GetAUser from "./getauser";

const AllUser = () => {
  const [getAllUser, setGetAllUSer] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserID] = useState("");
  const [isRefresh, setRefresh] = useState(false);
  const auth_token = JSON.parse(localStorage.getItem("accessToken" || ""));
  const [getaUser, setGetUser] = useState({});
  const [selectedItemData, setSelectedItemData] = useState("");

  useEffect(() => {
    defaultGetaUser();
  }, []);

  const defaultGetaUser = () => {
    const option = {
      method: "POST",
      url: "http://localhost:4000/api/auth/getUserById",
      data: {
        _id: userId,
      },
      headers: {
        authorization: auth_token,
      },
    };
    axios
      .request(option)
      .then((response) => {
        setGetUser(response?.data?.user);
        console.log(response?.data?.user, "user");
      })
      .catch((error) => {
        console.log("Error", error);
      });
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
    defaultUsers();
  }, [!isRefresh]);

  const defaultUsers = () => {
    const option = {
      method: "GET",
      url: "http://localhost:4000/api/auth/all-users",
    };
    axios
      .request(option)
      .then((response) => {
        setGetAllUSer(response.data.users);
        console.log(response.data.users, "user");
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
        url: `http://localhost:4000/api/auth/all-users?search=${search}`,
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
  return (
    <>
      <div>
        <div className="mt-2 lg:mt-3 xl:mt-4 2xl:mt-7 flex justify-between items-center 2xl:pt-4 2xl:px-10 border mx-10 lg:mx-8  bg-white rounded-lg   2xl:h-[100px] xl:h-[70px] lg:h-[60px] md:h-[50px] sm:h-[45px] h-[45px]  xl:px-8 lg:px-5 md:px-4 sm:px-4 px-4 2xl:text-2xl xl:text-[18px] lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px]">
          <h2 className="font-semibold">Users List </h2>

          <div className="flex items-center w-[40%]">
            <input
              type="search"
              className=" border border-gray-500 p-[2px] lg:p-[4px] 2xl:p-3 rounded-lg  w-11/12 focus:outline-none text-black"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="button-addon1"
              onChange={handleSearch}
            />
          </div>
          <h2>Welcome Back, Admin</h2>
        </div>

        <div className=" flex mx-5 sm:mx-10 lg:mx-8  overflow-x-auto md:overscroll-none ">
          <div className=" w-full ">
            <table className="w-[155%] sm:w-[100%]  border bg-white rounded-md mt-5 p-10">
              <thead className="">
                <tr
                  className="bg-coolGray-200 text-gray-400 text-start flex  
          2xl:text-[22px] 
          xl:text-[14px]
           lg:text-[12px] 
           md:text-[12px] 
           sm:text-[12px] 
           text-[10px]"
                >
                  <th className="mx-3 lg:mx-5 w-1/12 text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5   ">
                    S.NO
                  </th>
                  <th className="  w-3/12 text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5  ">
                    USER NAME
                  </th>
                  <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-5/12 sm:w-4/12 ">
                    EMAIL
                  </th>
                  <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-2/12 ">
                    Provider
                  </th>
                  <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-1/12 ">
                    VIEW
                  </th>
                </tr>
              </thead>
              {getAllUser?.length > 0 && (
                <tbody>
                  {getAllUser.map((item, index) => (
                    <tr
                      key={index}
                      className="text-start flex w-full 2xl:text-[22px] xl:text-[14px] lg:text-[12px] md:text-[12px] sm:text-[12px] text-[10px]"
                    >
                      <td className="my-2 mx-3 lg:mx-5 w-1/12">
                        {index + 1 + "."}
                      </td>
                      <td className="my-auto w-3/12">
                        {item.firstname} {item.lastname}
                      </td>

                      <td className="my-auto w-5/12 sm:w-4/12">{item.email}</td>
                      <td className="my-auto  w-2/12">{item.provider}</td>
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
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
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
    </>
  );
};

export default AllUser;
