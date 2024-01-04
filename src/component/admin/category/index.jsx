import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import EditCate from "./edit-module";
import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import DeleteModuleC from "./delete-module";
import CreateCategoryForm from "./add-module";

const Category = () => {
  const [getAllCate, setGetAllCate] = useState([]);
  const [cateEdit, setCateEdit] = useState("");
  const [editData, setEditData] = useState([]);
  const [categoryID, setCategoryID] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerOpenO, setIsDrawerOpenO] = useState(false);
  const [isOpenDelete, setOpenDelete] = useState(false);
  const [isRefresh, setRefresh] = useState(false);

  const openDrawerO = async (_id) => {
    setCateEdit(_id);
    try {
      const options = {
        method: "POST",
        url: "http://localhost:4000/api/category/getCategory",
        data: {
          id: _id,
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
    const option = {
      method: "GET",
      url: "http://localhost:4000/api/category/getallCategory",
    };
    axios
      .request(option)
      .then((response) => {
        setGetAllCate(response.data);
        console.log(response.data, "cate");
      })
      .catch((err) => {
        console.log(err, "Error");
      });
  };

  return (
    <>
      <div>
        <div className="lg:mt-3 xl:mt-4 2xl:mt-7 flex justify-between items-center 2xl:pt-4 2xl:px-10 border mx-10 lg:mx-8  bg-white rounded-lg   2xl:h-[100px] xl:h-[70px] lg:h-[60px] md:h-[50px] sm:h-[45px] h-[45px]  xl:px-8 lg:px-5 md:px-4 sm:px-4 px-4 2xl:text-2xl xl:text-[18px] lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px]">
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
        <div className=" flex justify-end  items-center 2xl:px-10 xl:px-8 lg:px-5 md:px-4 sm:px-3 px-2 border mx-10 lg:mx-8   rounded-lg bg-white 2xl:h-[100px] xl:h-[70px] lg:h-[60px] md:h-[50px] sm:h-[45px] lg:mt-5 sm:mt-3 mt-2 h-[45px]">
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
            className="fixed content-center mb-5 right-5 z-40 h-[50%] lg:h-[45%] lg:w-4/12 w-6/12  p-4 overflow-y-auto  transition-transform -translate-x-0 bg-white    border rounded-lg"
            tabIndex={-1}
            aria-labelledby="drawer-form-label"
          >
            <button
              type="button"
              onClick={closeDrawer}
              className=" border text-gray-400  shadow-2xl text-sm lg:w-14  top-2  inline-flex items-center justify-center "
            >
              Close
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
            className="fixed content-center mb-5 right-5 z-40 h-[50%] lg:h-[45%] lg:w-4/12 w-6/12 p-4 overflow-y-auto transition-transform -translate-x-0 bg-white "
            tabIndex={-1}
            aria-labelledby="drawer-form-label"
          >
            <button
              type="button"
              onClick={closeDrawerO}
              className="border  shadow-2xl text-sm lg:w-14  top-2  inline-flex items-center justify-center "
            >
              Close
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
        <div className="mx-10 lg:mx-8 z-10">
        <table className="border w-full table-auto bg-white rounded-md mt-5   relative   p-10">
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
              <th className="mx-5 w-2/12 text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5   ">
                S.NO
              </th>
              <th className="ml-10  w-4/12 text-start my-auto py-2 sm:py-2 md:py-2 lg:py-3 xl:py-4 2xl:py-5  ">
                EVENT NAME
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
                  <td className="mx-5 my-auto w-2/12">{index + 1 +"."}</td>
                  <td className="my-auto ml-10 w-4/12">{item.title}</td>

                  <td className="w-3/12">
                    <div className="flex my-3 gap-3">
                      <button onClick={() => openDrawerO(item?._id)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => openModal(item?._id)}
                        // className="rounded-md bg-gray-300 bg-opacity-20 px-4 py-2 text-sm font-medium hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
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
