"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import Link from "next/link";
import ShowSubCategory from "../sub-category/showSubCategory";
import DeleteModuleC from "../sub-category/delete-module";
import AddSubCategory from "./create-module";
import EditSubCategory from "../sub-category/edit-module";

const SubCategoryPage = () => {
  const [isOpenDelete, setOpenDelete] = useState(false);
  const [categoryID, setCategoryID] = useState("");
  const [isRefresh, setRefresh] = useState(false);
  const [issubCateDrwaer, setSubCateDrwaer] = useState(false);
  const [cateEdit, setCateEdit] = useState("");
  const [editData, setEditData] = useState([]);
  const [isDrawerOpenO, setIsDrawerOpenO] = useState(false);
  const [isLoadingBtn, setLoadingBtn] = useState(false);
  const [allSubCategory, setAllCategory] = useState([]);
  const auth_token = JSON.parse(localStorage.getItem("accessToken"));

  const openSubCategory = () => {
    setSubCateDrwaer(true);
  };

  const closeSubCategory = () => {
    setSubCateDrwaer(false);
  };

  function closeModal() {
    setOpenDelete(false);
  }

  function openModal(delId) {
    setCategoryID(delId);
    setOpenDelete(true);
  }

  useEffect(() => {
    defaultCategory();
  }, [isRefresh]);

  const defaultCategory = () => {
    setLoadingBtn(true);
    const options = {
      method: "GET",
      url: "http://localhost:4000/api/subCategory/getallSubCategory",
      headers: {
        "content-type": "application/json",
        authorization: auth_token,
      },
    };

    axios
      .request(options)
      .then((response) => {
        setAllCategory(response?.data);
        setLoadingBtn(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoadingBtn(false);
      });
  };

  const refreshData = () => {
    setRefresh(!isRefresh);
  };

  const openDrawerO = async ({ subCateId }) => {
    setCateEdit(subCateId);
    try {
      const options = {
        method: "POST",
        url: "http://localhost:4000/api/subCategory/getSubCategory",
        headers: {
          authorization: auth_token,
        },
        data: {
          id: subCateId,
        },
      };
      const response = await axios.request(options);
      if (response.status === 200) {
        setEditData(response?.data);
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

  // -------------search Sub Category----------

  return (
    <>
      <section>
        <div className="sm:mt-2 lg:mt-3 xl:mt-4 2xl:mt-7   border flex justify-between items-center 2xl:pt-4 2xl:px-10 mt-2 mx-10 lg:mx-8 rounded-lg bg-white 2xl:h-[100px] xl:h-[70px] lg:h-[60px] md:h-[50px] sm:h-[45px] h-[45px]  xl:px-8 lg:px-5 md:px-4 sm:px-4 px-4 2xl:text-2xl xl:text-[18px] lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px]">
          <h2 className="font-semibold "> Sub Category List </h2>
          <div className="w-[40%]">
            <input
              type="search"
              className=" border border-gray-500 p-[2px] lg:p-[4px] 2xl:p-3 rounded-lg  w-11/12 focus:outline-none "
              placeholder="Search"
              aria-label="Search"
              aria-describedby="button-addon1"
            />
          </div>
          <h2>Welcome Back, Admin</h2>
        </div>
        <div className=" flex justify-end  items-center 2xl:px-10 xl:px-8 lg:px-5 md:px-4 sm:px-3 px-2 border mx-10 lg:mx-8 rounded-lg bg-white  2xl:h-[100px] xl:h-[70px] lg:h-[60px] md:h-[50px] sm:h-[45px] lg:mt-5 sm:mt-3 mt-2 h-[45px]">
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
            className=" border-2 fixed content-center mb-5 right-5 z-40 h-[380px] p-4 overflow-y-auto transition-transform -translate-x-0 bg-white lg:w-4/12 w-6/12 "
            tabIndex={-1}
            aria-labelledby="drawer-form-label"
          >
            <button
              type="button"
              onClick={closeSubCategory}
              className= " border text-gray-400  shadow-2xl text-sm w-14  top-2  inline-flex items-center justify-center "
            >
              Close
              <span className="sr-only bg-black">Close menu</span>
            </button>
            <div>
              <AddSubCategory
                closeDrawer={closeSubCategory}
                refreshData={refreshData}
              />
            </div>
          </div>
        )}

        {isDrawerOpenO && (
          <div
            id="drawer-form"
            className="fixed content-center mb-5 right-5 z-40 h-[380px] p-4 overflow-y-auto transition-transform -translate-x-0 bg-white lg:w-4/12  w-6/12  "
            tabIndex={-1}
            aria-labelledby="drawer-form-label"
          >
            <button
              type="button"
              onClick={closeDrawerO}
              className="border text-gray-400  shadow-2xl text-sm w-14  top-2  inline-flex items-center justify-center "
            >
              Close
              <span className="sr-only bg-black">Close menu</span>
            </button>
            <div>
              <EditSubCategory
                cateEdit={cateEdit}
                editData={editData}
                refreshData={refreshData}
                closeDrawer={closeDrawerO}
              />
            </div>
          </div>
        )}

        <ShowSubCategory
          allSubCategory={allSubCategory}
          openDrawerO={openDrawerO}
          openModal={openModal}
        />
      </section>

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

export default dynamic(() => Promise.resolve(SubCategoryPage), { ssr: false });
