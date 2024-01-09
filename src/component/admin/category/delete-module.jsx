import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const DeleteModuleC = ({ categoryID, closeModal, refreshData }) => {
  const [isLoading, setLoading] = useState(false);
  const auth_token = JSON.parse(localStorage.getItem("accessToken" || ""));

  const handleClose = () => {
    closeModal();
    refreshData();
  };

  const handleDelete = (e) => {
    e.preventDefault();
    setLoading(true);

    const options = {
      method: "DELETE",
      url: "/api/category/deleteCategory",
      data: {
        id: categoryID,
      },
      headers: {
        Accept: "application/json",
        authorization: auth_token,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          setLoading(false);
          toast.success("Category Deleted successfully !");
          handleClose();
          refreshData();
        } else {
          setLoading(false);
          return;
        }
      })
      .catch(function (error) {
        setLoading(false);
        console.error(error);
        toast.error("Failed. something went wrong!");
      });
  };

  return (
    <>
      {/* <ToastContainer/> */}
      <div className="mt-2">
        <p className="lg:text-[16px] text-[16px] font-normal leading-[30px] text-gray-500 mt-4">
          Do you really want to delete these records? You cant't view this in
          your list anymore if you delete!
        </p>
      </div>

      <div className="mt-8">
        <div className="flex justify-between gap-x-5">
          <button
            className="w-full border border-1 rounded-md border-lightBlue-400 text-lightBlue-700 hover:bg-lightBlue-200 text-sm  px-2 py-3
                              hover:border-none"
            onClick={handleClose}
          >
            No, Keep It
          </button>
          {isLoading ? (
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
              // onClick={productDelete(id)}
              className="w-full border border-1 rounded-md 
                              text-sm 
                              border-red-400 text-red-700 hover:bg-red-200  px-2 py-3
                              hover:border-none"
              onClick={handleDelete}
            >
              Yes, Delete It
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default DeleteModuleC;
