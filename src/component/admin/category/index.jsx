import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import EditCate from "./edit-module";
import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import DeleteModuleC from "./delete-module";
import CreateCategoryForm from "./add-module";
import Loader from "../../loader";
import cut from "../../../../public/images/close-square.svg";
import Image from "next/image";
import { ToastContainer } from "react-toastify";

const Category = () => {
  const [getAllCate, setGetAllCate] = useState([]);
  const [cateEdit, setCateEdit] = useState("");
  const [editData, setEditData] = useState([]);
  const [categoryID, setCategoryID] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerOpenO, setIsDrawerOpenO] = useState(false);
  const [isOpenDelete, setOpenDelete] = useState(false);
  const [isRefresh, setRefresh] = useState(false);
  const [isLoader, setLoader] = useState(false);

  const openDrawerO = async (_id) => {
    setLoader(true);
    setCateEdit(_id);
    try {
      const options = {
        method: "POST",
        url: "/api/category/getCategory",
        data: {
          id: _id,
        },
      };
      const response = await axios.request(options);
      if (response.status === 200) {
        setEditData(response?.data);
        setIsDrawerOpenO(true);
        setLoader(false);
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
    setCategoryID(id);
    setOpenDelete(true);
  }
  const refreshData = () => {
    setRefresh(!isRefresh);
  };

  // -------GetAll category---------
  useEffect(() => {
    defaultgetAllCate();
  }, [isRefresh]);

  const defaultgetAllCate = () => {
    setLoader(true);
    const option = {
      method: "GET",
      url: "/api/category/getallCategory",
    };
    axios
      .request(option)
      .then((response) => {
        setGetAllCate(response.data);
        console.log(response.data, "cate");
        setLoader(false);
      })
      .catch((err) => {
        console.log(err, "Error");
      });
  };

  return (
    <>
      {isLoader && <Loader />}
<ToastContainer autoClose={1000}/>
      <div className="">
        <div className="mt-2 lg:mt-3 xl:mt-4 2xl:mt-7 flex justify-between items-center 2xl:pt-4 2xl:px-10 border ml-10 mr-4 lg:mx-8  bg-white rounded-lg   2xl:h-[100px] xl:h-[70px] lg:h-[60px] md:h-[50px] sm:h-[45px] h-[45px]  xl:px-8 lg:px-5 md:px-4 sm:px-4 px-1 2xl:text-2xl xl:text-[18px] lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px]">
          <h2 className="font-semibold">Category List </h2>

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
        <div className=" flex justify-end  items-center 2xl:px-10 xl:px-8 lg:px-5 md:px-4 sm:px-3 px-2 border ml-10 mr-4  lg:mx-8   rounded-lg bg-white 2xl:h-[100px] xl:h-[70px] lg:h-[60px] md:h-[50px] sm:h-[45px] lg:mt-5 sm:mt-3 mt-2 h-[45px]">
          <div className="">
            <button
              onClick={openDrawer}
              className="border hover:bg-gray-300 rounded-md my-auto bg-lightBlue-600  cursor-pointer 2xl:p-3  2xl:text-[22px] xl:p-2 xl:text-[14px] lg:p-[6px] lg:text-[12px] md:text-[10px] md:p-1 sm:text-[10px] sm:p-1 p-[3px] text-[10px]"
            >
              + Add Category
            </button>
          </div>
        </div>
        {isDrawerOpen && (
          <div
            id="drawer-form"
            className="fixed content-center mb-5 right-4 lg:right-8 z-40 h-[35%] sm:h-[45%] lg:h-[45%] lg:w-6/12 w-8/12  p-4 overflow-y-auto  transition-transform -translate-x-0 bg-white    border rounded-lg"
            tabIndex={-1}
            aria-labelledby="drawer-form-label"
          >
            <button
              type="button"
              onClick={closeDrawer}
              className="  text-gray-400  shadow-2xl text-sm   top-2  inline-flex items-center justify-center "
            >
              <img src="/images/close-square.svg" className="w-7 md:w-7 lg:w-8 xl:w-9 2xl:w-14" alt="close"/>

              <span className="sr-only bg-black">Close menu</span>
            </button>
            <div>
              <CreateCategoryForm
                closeDrawer={closeDrawer}
                refreshData={refreshData}
              />
            </div>
          </div>
        )}
        {isDrawerOpenO && (
          <div
            id="drawer-form"
            className="fixed content-center mb-5 right-4 lg:right-8 z-40 h-[40%] sm:h-[45%] lg:h-[45%] lg:w-6/12 w-8/12 p-4 overflow-y-auto transition-transform -translate-x-0 bg-white "
            tabIndex={-1}
            aria-labelledby="drawer-form-label"
          >
            <button
              type="button"
              onClick={closeDrawerO}
              className="  shadow-2xl text-sm top-2  inline-flex items-center justify-center "
            >
            <img src="/images/close-square.svg" className="w-7 md:w-7 lg:w-8 xl:w-9 2xl:w-14" alt="close"/>

              <span className="sr-only bg-black">Close menu</span>
            </button>
            <div>
              <EditCate
                cateEdit={cateEdit}
                closeDrawer={closeDrawerO}
                refreshData={refreshData}
                editData={editData}
              />
            </div>
          </div>
        )}
        <div className="ml-10 mr-4  lg:mx-8 ">
          <table className="z-10 border w-full table-auto bg-white rounded-md mt-5      p-10">
            <thead className="">
              <tr
                className="bg-coolGray-200 text-gray-400 text-start flex border 
          2xl:text-[22px] 
          xl:text-[14px]
           lg:text-[12px] 
           md:text-[12px] 
           sm:text-[12px] 
           text-[10px]"
              >
                <th className="mx-5 w-[30px] sm:w-2/12 text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5   ">
                  S.NO
                </th>
                <th className="xl:ml-10 w-6/12 sm:w-4/12 text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5  ">
                  CATEGORY NAME
                </th>

                <th className="text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5 w-3/12 ">
                  ACTION
                </th>
              </tr>
            </thead>
            {getAllCate?.length > 0 && (
              <tbody>
                {getAllCate.map((item, index) => (
                  <tr
                    key={index}
                    className="text-start flex w-full 2xl:text-[22px] xl:text-[14px] lg:text-[12px] md:text-[14px] sm:text-[13px] text-[10px]"
                  >
                    <td className="mx-5 my-auto w-[30px] sm:w-2/12">{index + 1 + "."}</td>
                    <td className="my-auto xl:ml-10 w-6/12 sm:w-4/12">{item.title}</td>

                    <td className="w-3/12">
                      <div className="flex my-3 gap-3">
                        <button onClick={() => openDrawerO(item?._id)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8 text-sky-600"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => openModal(item?._id)}
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
                  <DeleteModuleC
                    categoryID={categoryID}
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

export default Category;

{
  /* <TrashIcon className="cursor-pointer 2xl:h-8 2xl:w-8 xl:h-6 xl:w-6 md:h-6 md:w-6 h-5 w-5 text-red-800" />

        <PencilSquareIcon className="cursor-pointer 2xl:h-8 2xl:w-8 xl:h-6 xl:w-6 md:h-6 md:w-6 h-5 w-5  text-lightBlue-600 m-2 " /> */
}
