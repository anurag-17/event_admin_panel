"use client";
import React, { Fragment,useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Transition, Dialog } from "@headlessui/react";
import { ToastContainer } from "react-toastify";
import axios from "axios";

import ShowSubCategory from "../sub-category/showSubCategory";
import DeleteModuleC from "../sub-category/delete-module";
import AddSubCategory from "./create-module";
import EditSubCategory from "../sub-category/edit-module";
import Loader from "../../loader";
import Pagination from "../../pagination";

const SubCategoryPage = () => {
  const [isOpenDelete, setOpenDelete] = useState(false);
  const [categoryID, setCategoryID] = useState("");
  const [isRefresh, setRefresh] = useState(false);
  const [issubCateDrwaer, setSubCateDrwaer] = useState(false);
  const [cateEdit, setCateEdit] = useState("");
  const [editData, setEditData] = useState({});
  const [isDrawerOpenO, setIsDrawerOpenO] = useState(false);
  const [allSubCategory, setAllSubCategory] = useState([]);
  const [isLoader, setLoader] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");
  const [current_page, setCurrentPage] = useState(1);
  const [total_pages, setTotalPages] = useState(1);
  const [getallCategory, setGetallCategory] = useState([]);
  const [isLoadingBtn, setLoadingBtn] = useState(false);


  const limit = 20;
  const auth_token = JSON.parse(localStorage.getItem("accessToken") || "");

  const openSubCategory = () => setSubCateDrwaer(true);
  const closeSubCategory = () => setSubCateDrwaer(false);
  const closeModal = () => setOpenDelete(false);
  const openModal = (delId) => {
    setCategoryID(delId);
    setOpenDelete(true);
  };

  const fetchData = async (searchTerm = "", page, limit) => {
    setLoader(true);
    setLoadingBtn(true);
  
    try {
      const res = await axios.get(
        `/api/subCategory/getallSubCategory?searchQuery=${searchTerm}&limit=${limit}&page=${current_page}`,
        {
          headers: {
            "content-type": "application/json",
            authorization: auth_token,
          },
        }
      );
      console.log(res.data);
  
      if (res.status === 200) {
        setAllSubCategory(res?.data?.subCategories);
        setTotalPages(res?.data?.total_pages || 1);
      } else {
        console.error("Unexpected response status:", res.status);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoader(false);
      setLoadingBtn(false);
    }
  };
  
  const getAllSubCategory = async (page, limit) => {
    fetchData("", page, limit);
  };
  
  const searchDataFunc = async (searchTerm) => {
    if (searchTerm.trim() === "") {
      // If search term is empty, fetch data with current_page and limit
      getAllSubCategory(current_page, limit);
    } else {
      fetchData(searchTerm);
    }
  };
  
  const handleSearchChange = (event) => {
    searchDataFunc(event.target.value);
  };


  const refreshData = () => setRefresh(!isRefresh);

  const openDrawerO = async ({ subCateId }) => {
    setCateEdit(subCateId);
    setLoader(true);

    try {
      const res = await axios.post(
        "/api/subCategory/getSubCategory",
        { id: subCateId },
        {
          headers: {
            authorization: auth_token,
          },
        }
      );
      if (res.status === 200) {
        setEditData(res?.data);
        setIsDrawerOpenO(true);
        setLoader(false);
      } else {
        setLoader(false);
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      setLoader(false);
      console.error("Error:", error);
    } finally {
      setLoader(false);
    }
  };

  const closeDrawerO = () => setIsDrawerOpenO(false);

  const handlePageChange = (newPage) => {
    // alert(newPage)
    setCurrentPage(newPage);
  };

  const defaultCategory = () => {
    setLoadingBtn(true);
    const options = {
      method: "GET",
      url: "/api/category/getallCategory",
    };

    axios
      .request(options)
      .then((res) => {
        if (res.status == 200) {
          setGetallCategory(res?.data?.categories);
          setLoadingBtn(false);
        } else {
          setLoadingBtn(false);
          return;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoadingBtn(false);
      });
  };
  useEffect(() => {
    getAllSubCategory(current_page, limit);
  }, [isRefresh, current_page]);


  useEffect(() => {
    defaultCategory();
  }, [isRefresh]);


  // -------------search Sub Category----------

  return (
    <>
      <ToastContainer autoClose={1000} />

      {isLoader && <Loader />}
      <section>
        <div className="sm:mt-2 lg:mt-3 xl:mt-4 2xl:mt-7 border flex md:flex-row gap-y-3 py-4  flex-col justify-between items-center 2xl:pt-4 2xl:px-10 mt-2 ml-10 mr-4 lg:mx-8 rounded-lg bg-white 2xl:h-[100px] xl:h-[70px] lg:h-[60px]  h-auto xl:px-8 lg:px-5 md:px-4 sm:px-4 px-4 2xl:text-2xl xl:text-[18px] lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px]">
          <h2 className="font-semibold whitespace-nowrap"> Sub Category List </h2>
          <div className="lg:w-[40%] w-full mx-auto flex flex-col items-center">
            <input
              type="search"
              className="border border-gray-500 py-[2px] lg:py-[4px] 2xl:py-3 rounded-lg w-full lg:max-w-auto max-w-[320px] mx-auto md:w-11/12 focus:outline-none md:px-[15px] px-2 text-[15px] placeholder:text-[13px]"
              placeholder="Search"
              // value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <h2>Welcome Back, Admin</h2>
        </div>
        <div className=" flex justify-end  items-center 2xl:px-10 xl:px-8 lg:px-5 md:px-4 sm:px-3 px-2 border ml-10 mr-4 lg:mx-8 rounded-lg bg-white  2xl:h-[100px] xl:h-[70px] lg:h-[60px] md:h-[50px] sm:h-[45px] lg:mt-5 sm:mt-3 mt-2 h-[45px]">
          <div className="flex justify-around">
            <button
              onClick={openSubCategory}
              className=" rounded-md my-auto bg-lightBlue-600 border cursor-pointer 2xl:p-3  2xl:text-[18px] xl:p-2 xl:text-[14px] lg:p-[6px] lg:text-[12px] md:text-[10px] md:p-1 sm:text-[10px] sm:p-1 p-[3px] text-[10px]"
            >
              + Add Sub category
            </button>
          </div>
        </div>
        {issubCateDrwaer && (
          <div
            id="drawer-form"
            className=" border-2 fixed content-center mb-5 right-4 lg:right-8 z-40 h-[40%] sm:h-[45%] lg:h-[60%] p-4 overflow-y-auto transition-transform -translate-x-0 bg-white lg:w-6/12 w-8/12 "
            tabIndex={-1}
            aria-labelledby="drawer-form-label"
          >
            <button
              type="button"
              onClick={closeSubCategory}
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
              <AddSubCategory
                closeDrawer={closeSubCategory}
                refreshData={refreshData}
                isLoadingBtn={isLoadingBtn}
                getallCategory={getallCategory}
              />
            </div>
          </div>
        )}

        {isDrawerOpenO && (
          <div
            id="drawer-form"
            className="border fixed content-center mb-5 right-4 lg:right-8 z-40 h-[35%] sm:h-[45%] lg:h-[58%] p-4 overflow-y-auto transition-transform -translate-x-0 bg-white lg:w-6/12  w-8/12  "
            tabIndex={-1}
            aria-labelledby="drawer-form-label"
          >
            <button
              type="button"
              onClick={closeDrawerO}
              className=" text-gray-400  shadow-2xl text-sm top-2  inline-flex items-center justify-center "
            >
              <img
                src="/images/close-square.svg"
                className="w-7 md:w-7 lg:w-8 xl:w-9 2xl:w-14"
                alt="close"
              />

              <span className="sr-only bg-black">Close menu</span>
            </button>
            <div>
              <EditSubCategory
                cateEdit={cateEdit}
                editData={editData}
                refreshData={refreshData}
                closeDrawer={closeDrawerO}
                isLoadingBtn={isLoadingBtn}
                getallCategory={getallCategory}
              />
            </div>
          </div>
        )}

        <ShowSubCategory
        current_page={current_page}
          allSubCategory={allSubCategory}
          openDrawerO={openDrawerO}
          openModal={openModal}
        />
        {total_pages > 1 && (
          <Pagination
            total_pages={total_pages}
            current_page={current_page}
            onPageChange={handlePageChange}
          />
        )}
      </section>

      <Transition appear show={isOpenDelete} as={Fragment}>
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

export default dynamic(() => Promise.resolve(SubCategoryPage), { ssr: false });
