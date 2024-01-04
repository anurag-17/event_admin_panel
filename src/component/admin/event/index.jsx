import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import CreateEvent from "./create-module";
import EditEvent from "./update-module";
import DeleteEvent from "./delete-module";
import cut from "../../../../public/images/close-square.svg"

const Event = () => {
  const [getAllEvent, setGetAllCate] = useState([]);
  const [isRefresh, setRefresh] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerOpenO, setIsDrawerOpenO] = useState(false);
  const [isOpenDelete, setOpenDelete] = useState(false);
  const [eventID, setEventId] = useState("");
  const [editEvent, setEventEdit] = useState("");
  const [editData, setEditData] = useState([]);

  const openDrawerO = async (_id) => {
    setEventEdit(_id);
    try {
      const options = {
        method: "POST",
        url: "http://3.90.234.160:4000/api/event/getEvent",
        data: {
          id: _id,
        },
      };
      const response = await axios.request(options);
      if (response.status === 200) {
        setEditData(response.data);
        console.log(response.data, "A Event");

        setIsDrawerOpenO(true);
      } else {
        console.error("Error: Unexpected response status");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeDrawerO = () => {
    setIsDrawerOpenO(false);
  };

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  function closeModal() {
    setOpenDelete(false);
  }

  function openModal(id) {
    setEventId(id);
    setOpenDelete(true);
  }

  const refreshData = () => {
    setRefresh(!isRefresh);
  };

  useEffect(() => {
    defaultEvent();
  }, [!isRefresh]);

  const defaultEvent = () => {
    const option = {
      method: "GET",
      url: "http://3.90.234.160:4000/api/event/getAllEvents",
    };
    axios
      .request(option)
      .then((response) => {
        setGetAllCate(response.data.events);
        console.log(response.data.events, "Event");
      })
      .catch((err) => {
        console.log(err, "Error");
      });
  };

  return (
    <>
      <div>
        <div className="sm:mt-2 lg:mt-3 xl:mt-4 2xl:mt-7 flex justify-between items-center 2xl:px-10 border mx-10 lg:mx-8 bg-white rounded-lg 2xl:h-[100px] xl:h-[70px] lg:h-[60px] md:h-[50px] sm:h-[45px] h-[45px]  xl:px-8 lg:px-5 md:px-4 sm:px-4 px-4 2xl:text-2xl xl:text-[18px] lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px]">
          <h2 className="font-semibold">Event List </h2>

          <div className="flex items-center w-[40%]">
            <input
              type="search"
              className=" border border-gray-500 p-[2px] lg:p-[4px] 2xl:p-3 rounded-lg  w-11/12 focus:outline-none text-black"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="button-addon1"
            />
          </div>
          <h2>Welcome Back, Admin</h2>
        </div>
        <div className=" flex justify-end  items-center 2xl:px-10 xl:px-8 lg:px-5 md:px-4 sm:px-3 px-2 border mx-10 lg:mx-8    rounded-lg bg-white 2xl:h-[100px] xl:h-[70px] lg:h-[60px] md:h-[50px] sm:h-[45px] lg:mt-5 sm:mt-3 mt-2 h-[45px]">
          <div className="">
            <button
              onClick={openDrawer}
              className="border hover:bg-gray-300 rounded-md my-auto bg-lightBlue-600  cursor-pointer 2xl:p-3  2xl:text-[22px] xl:p-2 xl:text-[14px] lg:p-[6px] lg:text-[12px] md:text-[10px] md:p-1 sm:text-[10px] sm:p-1 p-[3px] text-[10px]"
            >
              + Add Event
            </button>
          </div>
        </div>
        {isDrawerOpen && (
          <div
            id="drawer-form"
            className="fixed content-center mb-5 z-40 h-[70%] lg:h-[80%] lg:w-8/12 w-10/12  p-4 overflow-y-auto  transition-transform -translate-x-0 bg-white border rounded-lg 2xl:top-32 xl:top-[85px] lg:top-[70px] right-8"
            tabIndex={-1}
            aria-labelledby="drawer-form-label"
          >
            <button
              type="button"
              onClick={closeDrawer}
              className=" text-gray-400  shadow-2xl text-sm   top-2  inline-flex items-center justify-center "
            >
              <Image src={cut} className="w-7 md:w-7 lg:w-8 xl:w-9 2xl:w-14"
              />
              <span className="sr-only bg-black">Close menu</span>
            </button>
            <div>
              <CreateEvent
                closeDrawer={closeDrawer}
                refreshData={refreshData}
              />
            </div>
          </div>
        )}
        {isDrawerOpenO && (
          <div
            id="drawer-form"
            className="border fixed content-center mb-5  z-40 h-[70%] lg:h-[80%] lg:w-8/12 w-10/12  p-4 overflow-y-auto transition-transform -translate-x-0 bg-white 2xl:top-32 xl:top-[85px] lg:top-[70px] right-8 "
            tabIndex={-1}
            aria-labelledby="drawer-form-label"
          >
            <button
              type="button"
              onClick={closeDrawerO}
              className="  shadow-2xl text-sm   top-1  inline-flex items-center justify-center "
            >
               <Image src={cut} className="w-7 md:w-7 lg:w-8 xl:w-9 2xl:w-14"
              />
              <span className="sr-only bg-black">Close menu</span>
            </button>
            <div>
              <EditEvent
                cateEdit={editEvent}
                closeDrawer={closeDrawerO}
                refreshData={refreshData}
                editData={editData}
              />
            </div>
          </div>
        )}
        <div className="mx-10 lg:mx-8 z-10">
          <table className="border w-full table-auto bg-white rounded-md mt-5   relative   p-10">
            <thead className="">
              <tr
                className="bg-coolGray-200 text-gray-400 text-start flex  px-2 border
          2xl:text-[22px] 
          xl:text-[14px]
           lg:text-[12px] 
           md:text-[12px] 
           sm:text-[12px] 
           text-[10px]"
              >
                <th className=" w-1/12 text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5   ">
                  S.NO
                </th>
                <th className="  w-3/12 text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5  ">
                  EVENT NAME
                </th>
                <th className=" w-1/12 text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5   ">
                  Price
                </th>
                <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-1/12 ">
                  City
                </th>
                <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-2/12 ">
                  Start Date
                </th>
                <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-2/12 ">
                  End Date
                </th>

                <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-2/12 ">
                  Location
                </th>
                <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-1/12 ">
                  Action
                </th>
              </tr>
            </thead>
            {getAllEvent?.length > 0 && (
              <tbody>
                {getAllEvent.map((item, index) => (
                  <tr
                    key={index}
                    className="p-2 text-start flex w-full 2xl:text-[22px] xl:text-[14px] lg:text-[12px] md:text-[14px] sm:text-[13px] text-[10px]"
                  >
                    <td className=" my-auto w-1/12">{index + 1 + "."}</td>
                    <td className="my-auto  w-3/12 ">{item.name}</td>
                    <td className="my-auto  w-1/12 ">{item.price}</td>
                    <td className="my-auto  w-1/12 ">{item.city}</td>
                    <td className="my-auto  w-2/12 ">{item.startDate}</td>
                    <td className="my-auto  w-2/12 ">{item.endDate}</td>
                    <td className="my-auto  w-2/12 ">{item.location}</td>
                    <td className="my-auto  w-1/12 ">
                      <div className="flex my-3 gap-3">
                        <button onClick={() => openDrawerO(item?._id)}>
                          Edit
                        </button>

                        <button
                          onClick={() => openModal(item?._id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
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
                  <DeleteEvent
                    eventID={eventID}
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

export default Event;

