"use client";
import axios from "axios";
import React, { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Pagination from "../../component/pagination";
import moment from "moment";
import { toast } from "react-toastify";

const Page = () => {
  const [getAllEvent, setGetAllEvent] = useState([]);
  const [current_page, setCurrentPage] = useState(1);
  const [isRefresh, setRefresh] = useState(false);
  const [limit, setLimit] = useState(10);
  const [total_pages, setTotalPages] = useState(1);
  const [isLoader, setLoader] = useState(false);
  const auth_token = JSON.parse(localStorage.getItem("accessToken" || ""));
  const [dialogMatch, setDialogMatch] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  //----------Date/Time Formate
  const convertTime = (time) => {
    const parsedDateTime = moment(time);
    const formattedDateTime = parsedDateTime.format("DD/MM/YYYY HH:mm");
    return formattedDateTime;
  };

  const refreshData = () => {
    setRefresh(!isRefresh);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    defaultEvent(current_page, limit);
  }, [current_page, isRefresh]);

  // const pageLimit = 12;
  const defaultEvent = (page, limit) => {
    setLoader(true);
    const option = {
      method: "GET",
      url: "/api/redirection/getAllEventRedirections",
      params: {
        page: page,
        limit: limit,
      },
      headers: {
        "content-type": "application/json",
        authorization: auth_token,
      },
    };
    axios
      .request(option)
      .then((response) => {
        console.log("res event", response?.data?.eventRedirections);
        setGetAllEvent(response?.data?.eventRedirections);
        setLoader(false);
        setTotalPages(response?.data?.total_pages || 1);
      })
      .catch((err) => {
        console.log(err, "Error");
      });
  };

  //   ------------Responded Event Delete----------
  const handleDelete = (eventID) => {
    console.log(eventID);
    // ;
    // alert("deleted successfully");
    // setDialogMatch(false);
    // return;

    const options = {
      method: "DELETE",
      url: `/api/redirection/deleteEventRedirection`,
      data: {
        _id: eventID,
      },
      headers: {
        "Content-Type": "application/json",
        authorization: auth_token,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          toast.success("Deleted successfully !");
          // handleClose();
          setDialogMatch(false);
          refreshData();
        } else {
        //   toast.error("Failed. something went wrong!");
          return;
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  return (
    <>
      <div className="min-h-screen bg-[#F3F3F3] pt-4">
        <div className=" flex justify-between items-center 2xl:pt-4 2xl:px-10 border ml-10 mr-4 lg:mx-8 bg-white rounded-lg 2xl:h-[100px] xl:h-[70px] lg:h-[60px] md:h-[50px] sm:h-[45px] h-[45px] xl:px-8 lg:px-5 md:px-4 sm:px-4 px-1 2xl:text-2xl xl:text-[18px] lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px]">
          <h2 className="font-semibold">Redirected Event List </h2>

          <div className="flex items-center w-[40%]">
            <input
              type="search"
              className="border border-gray-500 p-[2px] lg:p-[4px] 2xl:p-3 rounded-lg w-11/12 focus:outline-none text-black"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="button-addon1"
            />
          </div>
          <h2>Welcome Back, Admin</h2>
        </div>

        <div className="overflow-x-scroll">
          <div className="ml-10 mr-4  lg:mx-8    ">
            <table className="mx-auto w-[1200px]  table-auto mt-[20px] ">
              <thead>
                <tr className="border">
                  <th className="py-3 pl-5 px-2 text-left bg-[white]">
                    <p className="block text-[12px] md:text-[14px] font-medium  text-[#72727b]">
                      S.No
                    </p>
                  </th>
                  <th className="py-3 pl-5 px-2 text-left bg-[white]">
                    <p className="block text-[12px] md:text-[14px] font-medium  text-[#72727b]">
                      Event Name
                    </p>
                  </th>
                  <th className="py-3 px-5 text-left bg-[white] ">
                    <p className="block text-[12px] md:text-[14px] font-medium  text-[#72727b]">
                      Category
                    </p>
                  </th>
                  <th className="py-3 px-5 text-left bg-[white]">
                    <p className="block text-[12px] md:text-[14px] font-medium  text-[#72727b]">
                      Date
                    </p>
                  </th>

                  <th className="py-3 px-5 text-left bg-[white]">
                    <p className="block text-[12px] md:text-[14px] font-medium  text-[#72727b]">
                      Venue
                    </p>
                  </th>

                  <th className="py-3 px-5 text-left bg-[white]">
                    <p className="block text-[12px] md:text-[14px] font-medium  text-[#72727b]">
                      Response
                    </p>
                  </th>

                  <th className="py-3 px- text-left bg-[white]">
                    <p className="block text-[12px] md:text-[14px] font-medium  text-[#72727b]">
                      Delete
                    </p>
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white">
              {getAllEvent?.map((items, index) => {
  const serialNumber = (current_page - 1) * 10 + (index + 1);

  return (
    <tr key={items?._id}>
      <td className="text-[12px] md:text-[14px] font-[400] py-3 px-5 capitalize">
        {serialNumber + "."}
      </td>
      <td className="text-[12px] md:text-[14px] font-[400] py-3 px-5 capitalize">
        {items?.event?.name}
      </td>
      <td className="text-[12px] md:text-[14px] font-[400] py-3 px-5 capitalize">
        {items?.event?.category?.title}
      </td>
      <td className="text-[12px] md:text-[14px] font-[400] py-3 px-5 ">
        {items?.event?.startDate ? convertTime(items?.event?.startDate) : ""}
      </td>
      <td className="text-[12px] md:text-[14px] font-[400] py-3 px-5 capitalize">
        {items?.event?.city}
      </td>
      <td className="flex justify-center text-[12px] md:text-[14px] font-[400] py-3 px-5 ">
        {items?.redirection}
      </td>
      <td className="text-[12px] md:text-[14px] font-[400] py-3 ">
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
})}

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
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setDialogMatch(false)}
        >
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
                    className="flex justify-center lg:text-[20px] text-[16px] font-semibold leading-6 text-gray-900"
                  >
                    Are You Sure! Want to Delete?
                  </Dialog.Title>
                  <div className="mt-3 flex justify-center gap-14">
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

export default Page;
