import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";

const DeleteModuleC = ({ categoryID, closeModal, refreshData }) => {
  const [isLoading, setLoading] = useState(false);
  const { adminAuthToken } = useAuth();

  const handleClose = () => {
    closeModal();
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.delete("/api/subCategory/deleteSubCategory", {
        data: { id: categoryID },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: adminAuthToken,
        },
      });

      if (response.status === 200) {
        toast.success("SubCategory deleted successfully!");
        handleClose();
        refreshData();
      } else {
        toast.error("Failed, server error!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed. Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-2">
        <p className="custom_table_text font-normal  text-gray-500 mt-4">
          Do you really want to delete these records? You can't view this in
          your list anymore if you delete!
        </p>
      </div>

      <div className="mt-4 lg:mt-8">
        <div className="flex justify-between gap-x-5">
          <button
           className="w-full border border-1 rounded-md border-lightBlue-400 text-lightBlue-700 hover:bg-lightBlue-200 text-sm  px-2 py-3
                              hover:border-none  border-sky-400 text-sky-700 hover:bg-sky-200 custom_btn_d "
            onClick={handleClose}
          >
            No, Keep It
          </button>

          <button
            className={`w-full  rounded-md 
            custom_btn_d 
                              border-red-400 text-red-700 bg-red-200  
                              hover:border-none
                        ${isLoading ? 'bg-gray-200' : 'hover:bg-red-200'}
                        hover:border-none`}
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Yes, Delete It"}
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteModuleC;
