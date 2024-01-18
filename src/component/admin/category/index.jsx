import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { Transition, Dialog } from "@headlessui/react";
import EditCate from "./edit-module";
import DeleteModuleC from "./delete-module";
import CreateCategoryForm from "./add-module";
import Loader from "../../loader";
import Pagination from "../../pagination";
import Topbar from "../../../app/admin/admin-dashboard/topbar";
import { useAuth } from "../../../contexts/AuthContext";

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
  const [current_page, setCurrentPage] = useState(1);
  const [total_pages, setTotalPages] = useState(1);
  const limit = 20;
  // const auth_token = JSON.parse(localStorage.getItem("accessToken") || "");
  const { adminAuthToken } = useAuth();

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

  const fetchData = async (searchTerm = "", page, limit) => {
    setLoader(true);
    setLoader(true);

    try {
      const res = await axios.get(
        `/api/category/getallCategory?searchQuery=${searchTerm}&limit=${limit}&page=${current_page}`,
        {
          headers: {
            "content-type": "application/json",
            authorization: adminAuthToken,
          },
        }
      );
      console.log(res.data);

      if (res.status === 200) {
        setGetAllCate(res?.data?.categories);
        setTotalPages(res?.data?.total_pages || 1);
        setLoader(false);
      } else {
        setLoader(false);
        console.error("Unexpected response status:", res.status);
      }
    } catch (error) {
      setLoader(false);
      console.error("Error:", error);
    } finally {
      setLoader(false);
    }
  };

  const getAllCategory = async (page, limit) => {
    fetchData("", page, limit);
  };

  const searchDataFunc = async (searchTerm) => {
    if (searchTerm.trim() === "") {
      // If search term is empty, fetch data with current_page and limit
      getAllCategory(current_page, limit);
    } else {
      fetchData(searchTerm);
    }
  };

  const handleSearchChange = (event) => {
    searchDataFunc(event.target.value);
  };

  const handlePageChange = (newPage) => {
    // alert(newPage)
    setCurrentPage(newPage);
  };

  useEffect(() => {
    getAllCategory(current_page, limit);
  }, [isRefresh, current_page]);
  return (
    <>
      {isLoader && <Loader />}
      <ToastContainer autoClose={1000} />
      <Topbar />
      <div className="">
        <div className="sm:mt-2 lg:mt-3 xl:mt-4 2xl:mt-7 border flex md:flex-row gap-y-3 py-4  flex-col justify-between items-center 2xl:pt-4 2xl:px-10 mt-2 ml-10 mr-4 lg:mx-8 rounded-lg bg-white 2xl:h-[100px] xl:h-[70px] lg:h-[60px]  h-auto xl:px-8 lg:px-5 md:px-4 sm:px-4 px-4 2xl:text-2xl xl:text-[18px] lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px]">
          <h2 className="font-semibold whitespace-nowrap">Category List </h2>

          <div className="flex items-center w-[40%]">
            <input
              type="search"
              className="border border-gray-500 py-[2px] lg:py-[4px] 2xl:py-3 rounded-lg w-full lg:max-w-auto max-w-[320px] mx-auto md:w-11/12 focus:outline-none md:px-[15px] px-2 text-[15px] placeholder:text-[13px]"
              placeholder="Search"
              onChange={handleSearchChange}
            />
          </div>
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
            className="fixed content-center mb-5 right-4 lg:right-8 z-40 h-auto max-h-[400px] lg:w-6/12 w-8/12  p-4 overflow-y-auto  transition-transform -translate-x-0 bg-white    border rounded-lg"
            tabIndex={-1}
            aria-labelledby="drawer-form-label"
          >
            <button
              type="button"
              onClick={closeDrawer}
              className="  text-gray-400  shadow-2xl text-sm   top-2  inline-flex items-center justify-center "
            >
              <img
                src="/images/close-square.svg"
                className="w-7 md:w-7 lg:w-8 xl:w-9 2xl:w-14"
                alt="close"
              />

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
            className="fixed content-center mb-5 right-4 lg:right-8 z-40 h-auto max-h-[400px] lg:w-6/12 w-8/12  p-4 overflow-y-auto  transition-transform -translate-x-0 bg-white    border rounded-lg"
            tabIndex={-1}
            aria-labelledby="drawer-form-label"
          >
            <button
              type="button"
              onClick={closeDrawerO}
              className="  shadow-2xl text-sm top-2  inline-flex items-center justify-center "
            >
              <img
                src="/images/close-square.svg"
                className="w-7 md:w-7 lg:w-8 xl:w-9 2xl:w-14"
                alt="close"
              />

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

        <div className="ml-10 mr-4 lg:mx-8 h-[300px] xl:h-[400px] overflow-y-scroll  ">
          <table className="w-full border bg-white rounded-md mt-5 p-100">
            <thead className="sticky-header">
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
            {Array.isArray(getAllCate) && getAllCate?.length > 0 && (
              <tbody>
                {getAllCate?.map((item, index) => (
                  <tr
                    key={index}
                    className="text-start flex w-full 2xl:text-[22px] xl:text-[14px] lg:text-[12px] md:text-[14px] sm:text-[13px] text-[10px]"
                  >
                    <td className="mx-5 my-auto w-[30px] sm:w-2/12">
                      {index + 1 + 20 * (current_page - 1)}
                    </td>
                    <td className="my-auto xl:ml-10 w-6/12 sm:w-4/12 capitalize">
                      {item?.title}
                    </td>

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

            {Array.isArray(getAllCate) && getAllCate?.length === 0 && (
              <div className="py-6 px-4 border-t ">
                <p className="text-[14px] font-medium text-center">
                  {" "}
                  No Data Found{" "}
                </p>
              </div>
            )}
          </table>
        </div>
        {total_pages > 1 && (
          <Pagination
            total_pages={total_pages}
            current_page={current_page}
            onPageChange={handlePageChange}
          />
        )}
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
